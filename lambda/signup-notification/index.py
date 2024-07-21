import json
import boto3
import logging
import os

sns_client = boto3.client('sns')

# Initialize logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(e, context):
    event = json.loads(e['body'])
    print(event)
    # The ARN of the SNS topic
    # topic_arn = 'arn:aws:sns:us-east-1:759664679407:authentication'
    topic_arn = os.getenv('AUTHENTICATION_TOPIC_ARN')
    
    # Email address of the customer to subscribe
    # This email will be obtained from the Cognito registration part
    try:
        user_email = event['email']
    
    except Exception as error:
        print(error)
        message = f"Invalid email received: {error}"
        return {
            'statusCode': 400,
            'body': json.dumps(message)
        }
    request_type = "registration"

    # Subscription filter policy (only applies to registration requests)
    filter_policy = None
    if request_type == "registration":
        filter_policy = {
            "user_email": [user_email]
        }

    # Create SNS subscription
    try:
        response = sns_client.subscribe(
            TopicArn=topic_arn,
            Protocol='email',
            Endpoint=user_email,
            Attributes={'FilterPolicy': json.dumps(
                filter_policy) if filter_policy else None}
        )
        subscription_arn = response['SubscriptionArn']
        message = f"Successfully created SNS subscription for {user_email} (ARN: {subscription_arn})"
    except Exception as error:
        print(error)
        message = f"Error creating SNS subscription: {error}"

    print(message)
    return {
        'statusCode': 200,
        'body': json.dumps(message)
    }