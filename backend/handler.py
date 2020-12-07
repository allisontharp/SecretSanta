import json
from pprint import pprint
from DynamoFuncs import *
from SecretSantaFuncs import *

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
    # Generate matches 
    matches = generateSecretSantas(group)

    # Send Emails    

    # Send Response
    body = {
        "result":  matches
    }

    response = {
        "headers": {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Credentials': True},
        "statusCode": 200,
        "body": json.dumps(body)
    }

    r = sendEmail('allison.tharp@gmail.com','allison@techtrek.io','')
    print(r)
    return response