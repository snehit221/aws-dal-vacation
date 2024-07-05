import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { username, email } = event;

  const params = {
    TableName: "UserData",
    Item: {
      username: username,
      email: email,
    },
  };

  try {
    const command = new PutCommand(params);
    await ddbDocClient.send(command);
    return {
      statusCode: 200,
      body: "Data stored successfully!",
    };
  } catch (error) {
    console.error("Error storing the data:", error);
    return {
      statusCode: 400,
      body: error.message,
    };
  }
};
