import json
import boto3
import logging

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
        if not is_user_confirmed_subscribed(sns_client, topic_arn, user_email):
            
            response = sns_client.subscribe(
                TopicArn=topic_arn,
                Protocol='email',
                Endpoint=user_email,
                Attributes={'FilterPolicy': json.dumps(filter_policy) if filter_policy else None}
            )
            subscription_arn = response['SubscriptionArn']
            message = f"Successfully created SNS subscription for {user_email} (ARN: {subscription_arn})"
        
        else:
            # Message to be published when user is subsribed
            
            regis_message = "Hi, \n You have successfully registered."
            
            # Attributes that match the filter policy
            message_attributes = {
            'user_email': {
                'DataType': 'String',
                'StringValue': event['email']
                }
            }
        
            response = sns_client.publish(
            TopicArn=topic_arn,
            Message=regis_message,
            MessageAttributes=message_attributes
            )
        
            return {
                'statusCode': 200,
                'body': json.dumps(f"Message published for new registration for topic {topic_arn}")
            }   
            
    except Exception as error:
        message = f"Error creating SNS subscription: {error}"

    return {
        'statusCode': 200,
        'body': json.dumps(message)
    }

'''
function to check whether user is already subsribed with confirmed status or not
'''
def is_user_confirmed_subscribed(sns_client, topic_arn, user_email):

    try:
        paginator = sns_client.get_paginator('list_subscriptions_by_topic')
        for page in paginator.paginate(TopicArn=topic_arn):
            subscriptions = page.get('Subscriptions', [])

            for subscription in subscriptions:
                if subscription['Endpoint'] == user_email:
                    subscription_arn = subscription['SubscriptionArn']
                    attr_response = sns_client.get_subscription_attributes(SubscriptionArn=subscription_arn)
                    attributes = attr_response['Attributes']
                    if attributes.get('PendingConfirmation') == 'false':
                        return True  # Subscription is confirmed
        return False  # Subscription not found or not confirmed
    except Exception as e:
        print(f"Error checking subscription status: {e}")
        return False
