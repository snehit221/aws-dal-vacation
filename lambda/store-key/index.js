import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import axios from "axios";
import {
  CognitoIdentityProviderClient,
  AdminConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const dynamoDBClient = new DynamoDBClient({ region: process.env.REGION });
const confirmClient = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

export const handler = async (event) => {
  const { username, key } = event;

  if (!username || !key) {
    return {
      statusCode: 400,
      body: "Username and key required!",
    };
  }

  try {
    const getItemParams = {
      TableName: "SecurityQuestions",
      Key: {
        username: { S: username },
      },
    };

    const getItemCommand = new GetItemCommand(getItemParams);
    const { Item } = await dynamoDBClient.send(getItemCommand);

    if (!Item) {
      return {
        statusCode: 404,
        body: "User not found.",
      };
    }

    const updateItemParams = {
      TableName: "SecurityQuestions",
      Key: {
        username: { S: username },
      },
      UpdateExpression: "SET #keyAttr = :keyValue",
      ExpressionAttributeNames: {
        "#keyAttr": "key",
      },
      ExpressionAttributeValues: {
        ":keyValue": { S: key },
      },
    };

    const confirmUserParams = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
    };

    const updateItemCommand = new UpdateItemCommand(updateItemParams);
    await dynamoDBClient.send(updateItemCommand);

    const confirmCommand = new AdminConfirmSignUpCommand(confirmUserParams);
    const confirmResponse = await confirmClient.send(confirmCommand);
    console.log(confirmResponse);
    return {
      statusCode: 200,
      body: "Key added successfully, User added.",
    };
  } catch (error) {
    console.error("Error updating item:", error);
    return {
      statusCode: 500,
      body: "Failed to update item.",
    };
  }
};
