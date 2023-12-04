import json
import boto3
from boto3.dynamodb.conditions import Key
import time  # For generating the current timestamp
import decimal
def handler(event, context):
    print('received event:')
    
    
    event = json.loads(event.get("body"))
    print(event)
    print(event.get("userid"))
    dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')

    # Specify the table name
    table_name = 'meggitLeads-staging'
    table = dynamodb.Table(table_name)
    partition_key = 'userid'
    partition_value = 'abc'
     # Use current timestamp as interestId
    if event.get("action"):
        userid = event.get('userid', 'default_userid')
        interestId = event.get('interestId')
        configure_data = event
        configure_json = json.dumps(configure_data)
        update_item(table, userid, interestId, configure_json,event.get("action") )
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'success':"ok"})
        }        
    else:
        interest_id = decimal.Decimal(int(time.time() * 1000)) 
        new_item = {
            'userid': event.get('userid', 'default_userid'),  # Replace 'default_userid' with a default value if 'userid' is not in the event
            'interestId': interest_id,  # Use current timestamp as interestId
            'selectedItem': event.get('selectedItem', 'Nan'),
            'page1_text':event.get('page1_text', "NaN")
        }
        table.put_item(Item=new_item)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps({'interestId': str(interest_id)})
        }

def update_item(table, userid, interestId, configure_json, column):
    response = table.update_item(
            Key={
                'userid': userid,
                'interestId': decimal.Decimal(int(interestId))
            },
            UpdateExpression='SET #conf = :val',
            ExpressionAttributeNames={
                '#conf': column
            },
            ExpressionAttributeValues={
                ':val': configure_json
            }
        )