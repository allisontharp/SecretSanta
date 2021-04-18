// main.go
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/apex/gateway"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/gorilla/mux"
)

type DynamoRow struct {
	GroupName  string `json:"groupName"`
	UserName   string `json:"userName"`
	JsonObject string `json:"jsonObject"`
	HouseHolds string `json:"houseHolds"`
	Guid       string `json:"guid"`
	TableName  string `json:"tableName"`
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

func createItem(tableName string, dynamoRow DynamoRow) {
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
	createItem(row.TableName, row)
}

func main() {
	r := mux.NewRouter()
	r.Use(CORS) // handles OPTIONS
	r.HandleFunc("/insertRow", insertRowHandler)
	http.Handle("/", r)
	log.Fatal(gateway.ListenAndServe(":10000", nil))

}
