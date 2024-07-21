import boto3
import json
import os

sns_client = boto3.client('sns')

def lambda_handler(e, context):
    event = json.loads(e['body'])
    print(event)
    # The ARN of the SNS topic
    topic_arn = os.getenv('AUTHENTICATION_TOPIC_ARN')
    # topic_arn = 'arn:aws:sns:us-east-1:759664679407:authentication'
    
    # Message to be published
    message = "Hi, \n You have successfully logged in."

    try:
        # Attributes that match the filter policy
        message_attributes = {
        'user_email': {
            'DataType': 'String',
            'StringValue': event['email']
            }
        }
        
        response = sns_client.publish(
            TopicArn=topic_arn,
            Message=message,
            MessageAttributes=message_attributes
        )
        print(response)
        return {
            'statusCode': 200,
            'body': json.dumps(f"Message published to topic {topic_arn}")
        }
    except Exception as error:
        print(error)
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error publishing message: {error}")
        }

