import json
from pprint import pprint
from DynamoFuncs import *

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

def insertGroup(event, context):
    r = insertItemToTable('secretSanta', event)
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