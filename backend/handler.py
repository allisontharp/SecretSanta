import json
from pprint import pprint
from DynamoFuncs import *
from SecretSantaFuncs import *
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re

def getGroup(event, context):
    r = getItemsFromTable('secretSanta', Key('groupName').eq(event['pathParameters']['groupName']))
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event,
        "r": r
    }
    response = {
        "headers": {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Credentials': True},
        "statusCode": 200,
        "body": json.dumps(body)
    }
    return response

def getGroups(event, context):
    r = getItemsFromTable('secretSanta', Key('userName').eq('General'))
    body = {
        "result": r
    }
    response = {
        "headers": {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Credentials': True},
        "statusCode": 200,
        "body": json.dumps(body)
    }
    return response    

def insertRow(event, context):
    body = event['body']
    insertItemToTable('secretSanta', json.loads(body))
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }
    response = {
        "headers": {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Credentials': True},
        "statusCode": 200,
        "body": json.dumps(body)
    }
    return response

def getParticipants(event, context):
    r = getItemsFromTable('secretSanta', Key('groupName').eq(event['pathParameters']['groupName']))
        
    body = {
        "result":  [p for p in r if p['userName']!= 'General']
    }

    response = {
        "headers": {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Credentials': True},
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response

def updateHouseholds(event, context):
    body = json.loads(event['body'])
    print(body)
    key = {
        'groupName': body['groupName'],
        'userName': 'General'
    }
    updateExpression = 'set houseHolds=:h'
    expressionAttributeValues={
            ':h': body['households']
        }
    r = updateItem('secretSanta', key, updateExpression, expressionAttributeValues)


    body = {
        "result":  r
    }

    response = {
        "headers": {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Credentials': True},
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response

def generateMatches(event, context):
    group = json.loads(event['body'])
    print(group)
    participants = [p for p in group if p['userName'] != 'General']
    # Generate matches 
    matches = generateSecretSantas(group, 0)
    if(len(participants) != len(matches)):
        raise ValueError('Made {matchCount} matches but had {partCount} participants.  Matches: {matches}'.format(matchCount = len(matches), partCount = len(participants), matches = matches))

    # Send Emails    
    groupRules = [p for p in group if p['userName'] == 'General'][0]
    groupJson = json.loads(groupRules['jsonObject'])
    print('matches:')
    print(matches)
    for m in matches:
        j = json.loads(matches[m])
        santa = [p for p in group if p['userName'] == m][0]
        santaEmail = json.loads(santa['jsonObject'])['participantEmail']

        message = MIMEMultipart("alternative")
        message["Subject"] = "Secret Santa"
        message["From"] = emailVariable
        message["To"] = santaEmail

        participantColor = ''
        participantFood = ''
        participantTeam = ''
        participantScent = ''
        participantStore = ''
        participantGadget = ''
        participantEnough = ''
        participantEnjoy= ''
        participantMisc = ''
        if('participantColor' in j):
            participantColor = '<b>Favorite Color:</b> {color} \n<br>'.format(color = j['participantColor'])
        if('participantFood' in j):
            participantFood = '<b>Favorite food/candy/snack:</b> {food} \n<br>'.format(food = j['participantFood'])
        if('participantTeam' in j):
            participantTeam = '<b>Favorite team(s) and/or fictional character(s):</b> {val} \n<br>'.format(val = j['participantTeam'])
        if('participantScent' in j):
            participantScent = '<b>Favorite scent for the home:</b> {val} \n<br>'.format(val = j['participantScent'])
        if('participantStore' in j):
            participantStore = '<b>Stores they love just about everything:</b> {val} \n<br>'.format(val = j['participantStore'])
        if('participantGadget' in j):
            participantGadget = '<b>Gadgets or tools they want:</b> {val} \n<br>'.format(val = j['participantGadget'])
        if('participantEnough' in j):
            participantEnough = '<b>They have enough:</b>{val} \n<br>'.format(val = j['participantEnough'])
        if('participantEnjoy' in j):
            participantEnjoy = '<b>They think they would really enjoy:</b> {val} \n<br>'.format(val = j['participantEnjoy'])
        if('participantMisc' in j):
            participantMisc = '<b>Anything else:</b> {val} \n<br>'.format(val = j['participantMisc'])
        text = f"""Hey {m}! \n
You are {j['participantName']}'s Secret Santa!  Here are their responses: \n<br>
{re.sub('<[^>]*>','',participantColor)}
{re.sub('<[^>]*>','',participantFood)}  
{re.sub('<[^>]*>','',participantTeam)}   
{re.sub('<[^>]*>','',participantScent)}  
{re.sub('<[^>]*>','',participantStore)}
{re.sub('<[^>]*>','',participantGadget)}
{re.sub('<[^>]*>','',participantEnough)}
{re.sub('<[^>]*>','',participantEnjoy)}
{re.sub('<[^>]*>','',participantMisc)}
Remember, we are planning on trading gifts on {groupJson['groupDeadline']}.  We are trying to spend between ${groupJson['dollarMinimum']} and ${groupJson['dollarMaximum']}.
{groupJson['groupRules']}."""

        html = f"""<html><body>
Hey {m}! <br>\n
You are <b>{j['participantName']}'s</b> Secret Santa!  Here are their responses: <br>\n
{participantColor}
{participantFood} 
{participantTeam} 
{participantScent} 
{participantStore}
{participantGadget}
{participantEnough}
{participantEnjoy}
{participantMisc}
Remember, we are planning on trading gifts on {groupJson['groupDeadline']}.  We are trying to spend between ${groupJson['dollarMinimum']} and ${groupJson['dollarMaximum']}.
{groupJson['groupRules']}.
</body></html>"""   

        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")

        message.attach(part1)
        message.attach(part2)

        sendEmail(santaEmail,message)

    # Send Response
    body = {
        "result":  matches
    }

    response = {
        "headers": {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Credentials': True},
        "statusCode": 200,
        "body": json.dumps(body)
    }

    
    return response