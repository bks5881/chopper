import json
import boto3
from boto3.dynamodb.conditions import Key

def handler(event, context):
    print('received event:')
    print(event)
    dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')

    # Specify the table name
    table_name = 'meggitLeads-staging'
    table = dynamodb.Table(table_name)
    # Define the key condition expression to specify the partition key
    partition_key = 'userid'
    partition_value = 'abc'
    key_condition_expression = Key(partition_key).eq(partition_value)

    # Define the scan index forward to be false for descending order
    scan_index_forward = False

    # Perform the query
    response = table.query(
        KeyConditionExpression=key_condition_expression,
        ScanIndexForward=scan_index_forward,
        Limit=1
    )

    # Extract and process the results
    if 'Items' in response:
        items = response['Items']
        # Process the items as needed
        for item in items:
            print(item)
    else:
        print("No matching items found.")
        print(items)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': "done"
    }