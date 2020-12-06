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
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response

def insertGroup(event, context):
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response