import json
import boto3
import os

# Initialize SNS client
sns_client = boto3.client('sns')

def lambda_handler(event, context):
    print(event)
    # SQS can pass multiple messages at once, loop through each one
    
    for record in event['Records']:
        try:
            # The ARN of the SNS topic
            # topic_arn = 'arn:aws:sns:us-east-1:759664679407:authentication'
            topic_arn = os.getenv('AUTHENTICATION_TOPIC_ARN')
            
            # Get the body of the SQS message, which contains the actual data
            body = record['body']
            
            # Parse the JSON data
            data = json.loads(body)
            
            # Extract the email and success fields
            email = data.get('email')
            success = data.get('success')
            
            # message attributes to be applied for sending booking status email only to intented receiver.
            message_attributes = {
            'user_email': {
            'DataType': 'String',
            'StringValue': email
                }
            }
            
            if success:
                response = sns_client.publish(
                TopicArn=topic_arn,
                Message= "Hi, \n Your Booking is successfully confirmed.",
                MessageAttributes=message_attributes
                )
                
                return {
                'statusCode': 200,
                'body': json.dumps(f"Message published for success booking to customer {topic_arn}")
                }
            
            #publishi the booking failure scenario
            response = sns_client.publish(
                TopicArn=topic_arn,
                Message= "Hi, \n Your Booking request failed. Please retry.",
                MessageAttributes=message_attributes
                )
            
            # Print the email and success fields to the console
            print(f"Email: {email}, Success: {success}")
        
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
        except KeyError as e:
            print(f"Missing key in JSON data: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")

    return {
        'statusCode': 500,
        'body': json.dumps('Booking request failed.')
    }

