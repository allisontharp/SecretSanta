import sys
sys.path.insert(0, 'src/vendor')
import boto3
from boto3.dynamodb.conditions import Key, Attr
from dynamodb_json import json_util as dbjson
import json

dynamodb = boto3.resource('dynamodb', region_name='us-east-1', endpoint_url="https://dynamodb.us-east-1.amazonaws.com")

def getItemsFromTable(tableName, filterExpression = ''):
    table = dynamodb.Table(tableName)
    if(filterExpression == ''):
        response = table.scan()
    else:
        response = table.scan(FilterExpression=filterExpression)
    finalTable = response['Items']

    while 'LastEvaluatedKey' in response:
        if(filterExpression==''):
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        else:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'], FilterExpression=filterExpression)
        finalTable.ExclusiveStartKey(response['Items'])

    return finalTable 

def insertItemToTable(tableName, item):
    table = dynamodb.Table(tableName)
    table.put_item(Item = item)


def updateItem(tableName, key, updateExpression, expressionAttributeValues):
    table = dynamodb.Table(tableName)
    response = table.update_item(
        Key = key,
        UpdateExpression=updateExpression,
        ExpressionAttributeValues=expressionAttributeValues,
        ReturnValues="UPDATED_NEW"
    )
    return response

