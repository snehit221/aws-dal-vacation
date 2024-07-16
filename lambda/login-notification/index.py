import boto3
import json

sns_client = boto3.client('sns')

def lambda_handler(event, context):
    # The ARN of the SNS topic
    topic_arn = 'arn:aws:sns:us-east-1:813697295019:AuthenticationNotificationTopic'
    
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
        return {
            'statusCode': 200,
            'body': json.dumps(f"Message published to topic {topic_arn}")
        }
    except Exception as error:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error publishing message: {error}")
        }

