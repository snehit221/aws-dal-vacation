import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

export const handler = async (event) => {
  const { username, password, email, firstName, lastName } = event;

  if (!username || !password || !email || firstName || lastName) {
    return {
      statusCode: 400,
      body: "Missing required user details",
    };
  }

  const signUpParams = {
    ClientId: process.env.CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "given_name",
        Value: firstName,
      },
      {
        Name: "family_name",
        Value: lastName,
      },
    ],

    AutoConfirmUser: true,
  };

  try {
    await cognitoClient.send(new SignUpCommand(signUpParams));
    return {
      statusCode: 200,
      body: "User registered in Cognito",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
