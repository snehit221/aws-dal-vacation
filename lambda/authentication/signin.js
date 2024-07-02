import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

export const handler = async (event) => {
  const { username, password } = event;
  const clientId = process.env.CLIENT_ID;

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const data = await client.send(command);

    return {
      statusCode: 200,
      message: "User signed in successfully",
      authResult: data.AuthenticationResult,
    };
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      statusCode: 500,
      message: "Error signing in",
      error: error.message,
    };
  }
};
