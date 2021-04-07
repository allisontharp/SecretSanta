// main.go
package main

import (
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	// "github.com/aws/aws-sdk-go/service/s3"
)

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

func getGroups() {
	// Initialize a session that the SDK will use to load
	// credentials from the shared file ~/.aws/credentials
	// and region from the shared configuration file ~/.aws.config
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create a DynamoDB client
	svc := dynamodb.New(sess)

	// Create the input configuration instance
	input := &dynamodb.ListTablesInput{} // TODO: look up &
	fmt.Printf("Tables:\n")

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

func main() {
	// r := mux.NewRouter()
	// r.Use(CORS) // handles OPTIONS
	// // r.HandleFunc("/login", loginHandler)
	// // http.HandleFunc("/login", loginHandler)
	// log.Fatal(http.ListenAndServe(":10000", nil))
	getGroups()
}
