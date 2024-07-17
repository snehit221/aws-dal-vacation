import {
  CognitoIdentityProviderClient,
  AdminConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

export const handler = async (event) => {
  const { username } = JSON.parse(event.body);

  const params = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
  };

  try {
    const command = new AdminConfirmSignUpCommand(params);
    const response = await client.send(command);
    console.log(response);
    return {
      statusCode: 200,
      body: "User confirmed successfully!",
    };
  } catch (error) {
    console.error("Error confirming user:", error);
    return {
      statusCode: 400,
      body: error.message,
    };
  }
};
