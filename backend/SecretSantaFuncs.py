import random
import json
import smtplib, ssl
from config import * 

def generateSecretSantas(group, tryNumber):
    households = [h['houseHolds'] for h in group if h['userName'] == 'General'][0]
    participants = [p for p in group if p['userName'] != 'General']
    matchDictionary = {} # santa: child
    participantsWithoutSanta = participants.copy()
    maxTries = 10
    validMatches = True

    if (tryNumber <= maxTries):
        print(tryNumber)
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
            if (len(possibleMatches) > 0):
                # Save the match
                match = random.choice(possibleMatches)
                matchDictionary[participantName] = match['jsonObject']
                participantsWithoutSanta = [p for p in participantsWithoutSanta if p['userName'] != match['userName']]
            
            if(validMatches == True and p == participants[-1]):
                validMatches = False
                continue
    if len(matchDictionary) == len(participants):
        return matchDictionary
    else:
        tryNumber += 1
        generateSecretSantas(group, tryNumber)


def sendEmail(recipient,message):
    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"
    sender_email = emailVariable
    receiver_email = recipient
    password = passwordVariable

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())

