// main.go
package main

import (
	"encoding/json"
	"math/rand"
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
	IsChecked string `json:"isChecked"` // need to just not pass this but lazy..
}

type Household struct {
	Name             string `json:"name"`
	ParticipantNames string `json:"participantNames"`
}

func generateSecretSantas(group Group, participants []Participant, tryNumber int) {
	var households []Household
	json.Unmarshal([]byte(group.Households), &households)
	matchDictionary := make(map[string]string) // santa: child
	participantsWithoutSanta := participants
	maxTries := 10
	validMatches := true

	if tryNumber <= maxTries {
		matchDictionary = make(map[string]string)
		rand.Seed(time.Now().UnixNano())
		rand.Shuffle(len(participants), func(i, j int) { participants[i], participants[j] = participants[j], participants[i] })
		for _, p := range participants {
			participantName := p.Name
			participantEmail := p.Email
			// Remove participant from possible matches

			// Get the other people in the household
		}
	}
}

func main() {

}
