// main.go
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/apex/gateway"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
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

func readItems(tableName string, filt expression.ConditionBuilder, proj expression.ProjectionBuilder) []DynamoRow {
	expr, err := expression.NewBuilder().WithFilter(filt).WithProjection(proj).Build()
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

func getRowsHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("getRows called\n")
	/*
		available expressions: https://docs.aws.amazon.com/sdk-for-go/api/service/dynamodb/expression/
		payload:
		{
			"tableName": "<tablename",
			"filters": [
				{"field": "<fieldname">,
				"operation": "<equals/not equals/in>",
				"value": "<value>"}
			],
			"projection": [
				"<field one>, <field two>"
			]
		}
	*/
	reqBody, err := getPostBody(w, r)
	if err != nil {
		fmt.Printf("Error getting post body")
		return
	}
	// Try to parse body
	type Filters struct {
		Field     string `json:"field"`
		Operation string `json:"operation"`
		Value     string `json:"value"`
	}
	type Row struct {
		TableName  string     `json:"tableName,omitempty"`
		Filters    *[]Filters `json:"filters"`
		Projection []string   `json:"Projection,omitempty"`
	}
	row := &Row{
		Filters: &[]Filters{},
	}
	if err := json.Unmarshal(reqBody, &row); err != nil {
		log.Printf("Error parsing body: %v", err)
		w.WriteHeader(400)
		return
	}

	var filt expression.ConditionBuilder
	var proj expression.ProjectionBuilder

	for i, filter := range *row.Filters {
		var ifilt expression.ConditionBuilder
		if filter.Operation == "equals" {
			ifilt = expression.Name(filter.Field).Equal(expression.Value(filter.Value))
		} else if filter.Operation == "notequals" {
			ifilt = expression.Name(filter.Field).NotEqual(expression.Value(filter.Value))
		} else if filter.Operation == "in" {
			// couldnt get IN to work dynamically, so now it will be an OR
			for i, val := range strings.Split(filter.Value, ",") {
				var iInFilt expression.ConditionBuilder
				iInFilt = expression.Name(filter.Field).Equal(expression.Value(val))
				if i == 0 {
					ifilt = iInFilt
				} else {
					ifilt = ifilt.Or(iInFilt)
				}
			}
		}

		if i == 0 {
			filt = ifilt
		} else {
			filt = filt.And(ifilt)
		}
	}

	for i, p := range *&row.Projection {
		if i == 0 {
			proj = expression.NamesList(expression.Name(p))
		} else {
			proj = proj.AddNames(expression.Name(p))
		}
	}

	// Read
	items := readItems(row.TableName, filt, proj)

	jData, err := json.Marshal(items)
	if err != nil {
		// handle error
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func main() {
	r := mux.NewRouter()
	r.Use(CORS) // handles OPTIONS
	r.HandleFunc("/getRows", getRowsHandler)
	http.Handle("/", r)
	log.Fatal(gateway.ListenAndServe(":10000", nil))

}
