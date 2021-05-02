// main.go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"time"
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
	Name             string `json:"name"`
	ParticipantGUIDs string `json:"participantGUIDs"`
}

type RequestBody struct {
	Group        Group         `json:"group"`
	Participants []Participant `json:"participants"`
}

func readRequestBody(body []byte) (RequestBody, error) {
	var requestBody RequestBody
	err := json.Unmarshal(body, &requestBody)
	if err != nil {
		return requestBody, err
	}
	return requestBody, nil
}

func removeParticipantFromPossibleMatches(participantsWithoutSanta []Participant, participantName string) []Participant {
	var possibleMatches []Participant
	for _, participant := range participantsWithoutSanta {
		if participant.Name != participantName {
			possibleMatches = append(possibleMatches, participant)
		}
	}
	return possibleMatches
}

func getOtherPeopleInHousehold(houseHolds []Household, participantGUID string) {
	for _, household := range houseHolds {

	}
}

func generateSecretSantas(group Group, participants []Participant, tryNumber int) {
	var households []Household
	json.Unmarshal([]byte(group.Households), &households)
	matchDictionary := make(map[string]string) // santa: child
	participantsWithoutSanta := participants
	maxTries := 10
	validMatches := true

	fmt.Printf("\n\nmatchDictionary: %v\n", matchDictionary)
	fmt.Printf("participantsWithoutSanta: %v\n", participantsWithoutSanta)
	fmt.Printf("validMatches: %v\n", validMatches)
	if tryNumber <= maxTries {
		matchDictionary = make(map[string]string)
		rand.Seed(time.Now().UnixNano())
		rand.Shuffle(len(participants), func(i, j int) { participants[i], participants[j] = participants[j], participants[i] })
		for _, p := range participants {
			participantName := p.Name
			participantEmail := p.Email
			fmt.Printf("\n\nparticipantName: %v\n", participantName)
			fmt.Printf("participantEmail: %v\n", participantEmail)
			// Remove participant from possible matches
			possibleMatches := removeParticipantFromPossibleMatches(participantsWithoutSanta, participantName)
			fmt.Printf("possibleMatches:\n%v\n", possibleMatches)
			// Get the other people in the household

		}
	}
}

func main() {
	fmt.Printf("main started!\n")
	jsonFile, err := os.Open("../testing/generateMatchesInput.json")
	if err != nil {
		fmt.Println(err)
	}
	byteValue, _ := ioutil.ReadAll(jsonFile)
	requestBody, err := readRequestBody(byteValue)
	fmt.Println(requestBody)
	fmt.Printf("\n\nHouseholds:\n%v\n", requestBody.Group.Households)

	generateSecretSantas(requestBody.Group, requestBody.Participants, 1)
}
