import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

export const handler = async (event) => {
  const { username, code } = event;
  const clientId = process.env.CLIENTID;

  const params = {
    ClientId: clientId,
    Username: username,
    ConfirmationCode: code,
  };

  try {
    const command = new ConfirmSignUpCommand(params);
    const data = await client.send(command);
    return {
      statusCode: 200,
      message: "User signed up successfully",
    };
  } catch (error) {
    console.error("Error signing up user:", error);
    return {
      statusCode: 500,
      message: "Error signing up user",
    };
  }
};
