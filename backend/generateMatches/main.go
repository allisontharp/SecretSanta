// main.go
package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/apex/gateway"
	"github.com/gorilla/mux"
)

type Group struct {
	Guid             string `json:"guid"`
	GroupName        string `json:"groupName"`
	DollarMinimum    string `json:"dollarMinimum"`
	DollarMaximum    string `json:"dollarMaximum"`
	GroupDescription string `json:"groupDescription"`
	GroupDeadline    string `json:"groupDeadline"`
	Households       string `json:"households"`
}

type Participant struct {
	Guid      string `json:"guid"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Color     string `json:"color"`
	Food      string `json:"food"`
	Team      string `json:"team"`
	Scent     string `json:"scent"`
	Store     string `json:"store"`
	Gadget    string `json:"gadget"`
	Enough    string `json:"enough"`
	Enjoy     string `json:"enjoy"`
	Misc      string `json:"misc"`
	IsChecked bool   `json:"isChecked"` // need to just not pass this but lazy..
}

type Household struct {
	Name             string   `json:"name"`
	ParticipantGUIDs []string `json:"participantGUIDs"`
}

type RequestBody struct {
	Group        Group         `json:"group"`
	Participants []Participant `json:"participants"`
}

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

// func readRequestBody(body []byte) (RequestBody, error) {
// 	var requestBody RequestBody
// 	err := json.Unmarshal(body, &requestBody)
// 	if err != nil {
// 		return requestBody, err
// 	}
// 	return requestBody, nil
// }

func removeParticipantFromPossibleMatches(participantsWithoutSanta []Participant, participantGUID string) []Participant {
	var possibleMatches []Participant
	for _, participant := range participantsWithoutSanta {
		if participant.Guid != participantGUID {
			possibleMatches = append(possibleMatches, participant)
		}
	}
	return possibleMatches
}

func getOtherPeopleInHousehold(houseHolds []Household, participantGUID string) ([]string, error) {
	var householdParticipants []string
	for _, household := range houseHolds {
		if stringInSlice(participantGUID, household.ParticipantGUIDs) {
			return household.ParticipantGUIDs, nil
		}
	}
	return householdParticipants, nil
}

func stringInSlice(a string, list []string) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}

func removeStringFromArray(checkString string, list []string) []string {
	var output []string
	for _, s := range list {
		if s != checkString {
			output = append(output, s)
		}
	}
	return output
}

func generateSecretSantas(group Group, participants []Participant, tryNumber int) (map[string]Participant, error) {
	var households []Household
	var possibleMatches []Participant
	json.Unmarshal([]byte(group.Households), &households)
	matchDictionary := make(map[string]Participant) // santa: child
	participantsWithoutSanta := participants
	maxTries := 10
	validMatches := true

	fmt.Printf("try: %v/%v\n", tryNumber, maxTries)
	if tryNumber <= maxTries {
		matchDictionary = make(map[string]Participant)
		rand.Seed(time.Now().UnixNano())
		rand.Shuffle(len(participants), func(i, j int) { participants[i], participants[j] = participants[j], participants[i] })
		for _, p := range participants {
			// fmt.Printf("\n\n%v\n", p.Name)
			// Remove participant from possible matches
			possibleMatches = removeParticipantFromPossibleMatches(participantsWithoutSanta, p.Guid)
			// fmt.Printf("\tpossibleMatches:%v\n", possibleMatches)
			// Get the other people in the household
			householdParticipants, _ := getOtherPeopleInHousehold(households, p.Guid)
			if len(householdParticipants) > 0 {
				for _, householdParticipant := range householdParticipants {
					possibleMatches = removeParticipantFromPossibleMatches(possibleMatches, householdParticipant)
				}
			}
			// Save match
			if len(possibleMatches) > 0 {
				randomIndex := rand.Intn(len(possibleMatches))
				match := possibleMatches[randomIndex]
				matchDictionary[p.Guid] = match
				participantsWithoutSanta = removeParticipantFromPossibleMatches(participantsWithoutSanta, match.Guid)
			}

			if validMatches == true && p == participants[len(participants)-1] {
				validMatches = false
				continue
			}
		}
	}

	fmt.Printf("len(matchDictionary)=%v\nlen(participants)=%v\n", len(matchDictionary), len(participants))
	if len(matchDictionary) == len(participants) {
		return matchDictionary, nil
	} else {
		tryNumber += 1
		_, _ = generateSecretSantas(group, participants, tryNumber)
	}
	return make(map[string]Participant), nil
}

func pprintMatchDictionary(matchDictionary map[string]Participant) {
	fmt.Printf("\n")
	for key, value := range matchDictionary {
		fmt.Printf("%v gets %v\n", key, value.Name)
	}
}

func generateMatchesHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("generateMatches called\n")

	var requestBody RequestBody

	reqBody, err := getPostBody(w, r)
	if err != nil {
		fmt.Printf("Error getting post body: %v", err)
		w.WriteHeader(400)
		return
	}

	err = json.Unmarshal(reqBody, &requestBody)
	if err != nil {
		fmt.Printf("Error unmarshalling post body: %v", err)
		w.WriteHeader(400)
		return
	}

	matchDictionary, err := generateSecretSantas(requestBody.Group, requestBody.Participants, 1)
	if err != nil {
		fmt.Printf("Error generating matches: %v", err)
	}

	jData, err := json.Marshal(matchDictionary)
	if err != nil {
		fmt.Printf("Error marshalling matchDictionary: %v", err)
		w.WriteHeader(400)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jData)
}

func main() {
	// fmt.Printf("main started!\n")
	// jsonFile, err := os.Open("../testing/generateMatchesInput.json")
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// byteValue, _ := ioutil.ReadAll(jsonFile)
	// requestBody, err := readRequestBody(byteValue)
	// // fmt.Printf("\n\nHouseholds:\n%v\n", requestBody.Group.Households)

	// matchDictionary, err := generateSecretSantas(requestBody.Group, requestBody.Participants, 1)
	// if err != nil {
	// 	fmt.Printf("Error with generateSecretSanta: %v", err)
	// 	return
	// }
	// pprintMatchDictionary(matchDictionary)
	r := mux.NewRouter()
	r.Use(CORS)
	r.HandleFunc("/generateMatches", generateMatchesHandler)
	http.Handle("/", r)
	log.Fatal(gateway.ListenAndServe(":10000", nil))
}
