// main.go
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"github.com/gorilla/mux"
	// "github.com/aws/aws-sdk-go/service/s3"
)

var tableName = "secretSanta"

type Participant struct {
	Name   string `json:"name"`
	Email  string `json:"email"`
	Color  string `json:"color"`
	Food   string `json:"food"`
	Team   string `json:"team"`
	Scent  string `json:"scent"`
	Store  string `json:"store"`
	Enough string `json:"enough"`
	Enjoy  string `json:"enjoy"`
	Misc   string `json:"misc"`
}

type HouseHold struct {
	name         string
	participants []string
}
type DynamoRow struct {
	GroupName  string `json:"groupName"`
	UserName   string `json:"userName"`
	JsonObject string `json:"jsonObject"`
	HouseHolds string `json:"houseHolds"`
}

// Initialize a session that the SDK will use to load
// credentials from the shared file ~/.aws/credentials
// and region from the shared configuration file ~/.aws.config
var sess = session.Must(session.NewSessionWithOptions(session.Options{
	SharedConfigState: session.SharedConfigEnable,
}))

// Create a DynamoDB client
var svc = dynamodb.New(sess)

// example from asanchez.dev/blob/cors-golang-options
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// set headers
		(w).Header().Set("Access-Control-Allow-Origin", "*")
		(w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		(w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		fmt.Println("ok")

		next.ServeHTTP(w, r)
		return
	})
}

/////////////////////
// CRUD Operations //
/////////////////////

func listTables() {
	// Create the input configuration instance
	input := &dynamodb.ListTablesInput{}

	for {
		// get the list of tables
		result, err := svc.ListTables(input)
		if err != nil {
			if aerr, ok := err.(awserr.Error); ok {
				switch aerr.Code() {
				case dynamodb.ErrCodeInternalServerError:
					fmt.Println(dynamodb.ErrCodeInternalServerError, aerr.Error())
				default:
					fmt.Println(aerr.Error())
				}
			} else {
				fmt.Println(err.Error())
			}
			return
		}
		for _, n := range result.TableNames {
			fmt.Println(*n)
		}

		input.ExclusiveStartTableName = result.LastEvaluatedTableName
		if result.LastEvaluatedTableName == nil {
			break
		}
	}
}

func readItems(filt expression.ConditionBuilder, proj expression.ProjectionBuilder) []DynamoRow {

	expr, err := expression.NewBuilder().WithFilter(filt).WithProjection(proj).Build()
	// expr, err := expression.NewBuilder().WithFilter(filt).WithProjection(proj).Build()
	if err != nil {
		log.Fatalf("Got error building expression: %s", err)
	}

	params := &dynamodb.ScanInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		FilterExpression:          expr.Filter(),
		ProjectionExpression:      expr.Projection(),
		TableName:                 aws.String(tableName),
	}

	result, err := svc.Scan(params)
	if err != nil {
		log.Fatalf("Query API call failed: %s", err)
	}

	items := []DynamoRow{}
	_ = dynamodbattribute.UnmarshalListOfMaps(result.Items, &items)

	return items
}

func createItem(dynamoRow DynamoRow) {
	av, err := dynamodbattribute.MarshalMap(dynamoRow)
	if err != nil {
		log.Fatalf("Got error marshalling new item: %s", err)
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(tableName),
	}

	_, err = svc.PutItem(input)
	if err != nil {
		log.Fatalf("Got error calling PutItem: %s", err)
	}
}

///////////////
// Handlers //
//////////////
func getPostBody(w http.ResponseWriter, r *http.Request) ([]byte, error) {
	if r.Method != "POST" {
		fmt.Println(r.Method)
		w.WriteHeader(400)
		fmt.Printf("Not POST method!\n")
		return nil, errors.New("Not post method!")
	}

	// get the body of the POST request
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading post body: %v", err)
		w.WriteHeader(500)
		return nil, err
	}

	return reqBody, nil
}

func insertRowHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("insertRow called\n")
	reqBody, err := getPostBody(w, r)
	if err != nil {
		fmt.Printf("Error getting post body")
		return
	}
	// Try to parse body
	var row DynamoRow
	if err := json.Unmarshal(reqBody, &row); err != nil {
		log.Printf("Error parsing body: %v", err)
		w.WriteHeader(400)
		return
	}
	// Write to db
	createItem(row)
}

func getParticipantsHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("getParticipants called\n")
	reqBody, err := getPostBody(w, r)
	if err != nil {
		fmt.Printf("Error getting post body")
		return
	}
	// Try to parse body
	var row DynamoRow
	if err := json.Unmarshal(reqBody, &row); err != nil {
		log.Printf("Error parsing body: %v", err)
		w.WriteHeader(400)
		return
	}
	filt := expression.Name("groupName").Equal(expression.Value(row.GroupName)).And(expression.Name("userName").NotEqual(expression.Value("General")))
	proj := expression.NamesList(expression.Name("userName"))
	// Read
	items := readItems(filt, proj)
	var list []string
	for _, user := range items {
		list = append(list, user.UserName)
	}
	fmt.Println(list)
	jData, err := json.Marshal(list)
	if err != nil {
		// handle error
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func main() {
	r := mux.NewRouter()
	r.Use(CORS) // handles OPTIONS
	r.HandleFunc("/insertRow", insertRowHandler)
	r.HandleFunc("/getParticipants", getParticipantsHandler)
	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":10000", nil))

}
