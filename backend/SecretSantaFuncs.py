import random
import json

def generateSecretSantas(group):
    households = [h['houseHolds'] for h in group if h['userName'] == 'General'][0]
    participants = [p for p in group if p['userName'] != 'General']
    matchDictionary = {} # santa: child
    participantsWithoutSanta = participants.copy()
    maxTries = 3
    tryNumber = 0
    validMatches = True
    isComplete = False

    while validMatches == True:
        matchDictionary = {} # santa: child
        participantsWithoutSanta = participants.copy()
        random.shuffle(participants)
        for p in participants:
            participantName = p['userName']
            participantJson = json.loads(p['jsonObject'])
            participantEmail = participantJson['participantEmail']
            # Remove participant from possible matches
            possibleMatches = [p for p in participantsWithoutSanta if p['userName'] != participantName] 
            # Get the other people in the household
            householdParticipants = [h['householdParticipants'] for h in households if participantName in h['householdParticipants']]
            if(len(householdParticipants) > 0):
                householdParticipants = householdParticipants[0]
                for h in householdParticipants:
                    possibleMatches = [p for p in possibleMatches if p['userName'] != h]
            # Should probably check if there are no matches here..
            if(len(possibleMatches) == 0 and tryNumber < maxTries):
                tryNumber += 1
            elif (len(possibleMatches) > 0):
                # Save the match
                match = random.choice(possibleMatches)
                matchDictionary[participantName] = match['jsonObject']
                participantsWithoutSanta = [p for p in participantsWithoutSanta if p['userName'] != match['userName']]
            else:
                validMatches = False

            if(validMatches == True and p == participants[-1]):
                validMatches = False
                isComplete = True
                continue
    if isComplete:
        return matchDictionary


def sendEmail(sender,recipient,participantPreferences):
   