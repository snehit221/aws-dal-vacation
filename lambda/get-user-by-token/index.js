const { CognitoJwtVerifier } = require("aws-jwt-verify");

// Create a Cognito JWT Verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID,
  tokenUse: "id", // Use 'id' for idToken and 'access' for accessToken
  clientId: process.env.CLIENT_ID,
});

exports.handler = async (event) => {
  let token = event.headers.Authorization || event.headers.authorization;

  token = token.slice("Bearer".length).trim();

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  try {
    // Verify the token
    const payload = await verifier.verify(token);

    return {
      statusCode: 200,
      body: payload,
    };
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized", error: err.message }),
    };
  }
};
