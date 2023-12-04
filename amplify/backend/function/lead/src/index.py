import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
def handler(event, context):
    print('received event:')
    print(event)
    userid = event['pathParameters']['userid']
    interestid = Decimal(event['pathParameters']['sessionid'])
    dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')

    # Specify the table name
    table_name = 'meggitLeads-staging'
    table = dynamodb.Table(table_name)
    try:
        response = table.get_item(
            Key={
                'userid': userid,
                'interestId': interestid
            }
        )
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps('Error retrieving item from DynamoDB')
    }
    item = response.get('Item', None)
    if item:
        item['interestId'] = str(int(item['interestId']))
        return {
            'statusCode': 200,
                'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(item)
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps('Item not found')
        }

# Check if item found and return result
