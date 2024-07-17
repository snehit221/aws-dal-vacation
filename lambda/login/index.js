import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});
const dynamoDBClient = new DynamoDBClient({ region: process.env.REGION });

export const handler = async (event) => {
  const { username, password } = event;

  const clientId = process.env.CLIENT_ID;

  const authParams = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const authCommand = new InitiateAuthCommand(authParams);
    const authResponse = await cognitoClient.send(authCommand);

    console.log(authResponse);

    const Lastlogindate = new Date().toISOString();
    const updateParams = {
      TableName: "UserData",
      Key: {
        username: { S: username },
      },
      UpdateExpression: "SET Lastlogindate = :Lastlogindate",
      ExpressionAttributeValues: {
        ":Lastlogindate": { S: Lastlogindate },
      },
    };

    const updateCommand = new UpdateItemCommand(updateParams);
    await dynamoDBClient.send(updateCommand);

    return {
      statusCode: 200,
      body: {
        message: "User signed in!",
        accessToken: authResponse.AuthenticationResult.AccessToken,
        idToken: authResponse.AuthenticationResult.IdToken,
        refreshToken: authResponse.AuthenticationResult.RefreshToken,
      },
    };
  } catch (error) {
    console.error("Error signing in user:", error);
    return {
      statusCode: 400,
      body: error.message,
    };
  }
};