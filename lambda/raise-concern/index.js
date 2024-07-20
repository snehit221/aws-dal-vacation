const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const axios = require("axios").default;

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const { userId } = JSON.parse(event.body);
    const scanParams = {
      TableName: "UserData",
      FilterExpression: "#role = :role",
      ExpressionAttributeNames: {
        "#role": "role",
      },
      ExpressionAttributeValues: {
        ":role": "admin",
      },
    };

    const data = await ddbDocClient.send(new ScanCommand(scanParams));

    if (!data.Items || data.Items.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "No admin users found" }),
      };
    }

    const randomIndex = Math.floor(Math.random() * data.Items.length);
    const randomAdminUser = data.Items[randomIndex];

    await axios.post(
      "https://us-central1-csci-418118.cloudfunctions.net/publisher",
      {
        userId,
        agentId: randomAdminUser.username,
        message: "Hello, I have a concern.",
      }
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ user: randomAdminUser }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Could not retrieve admin user" }),
    };
  }
};
