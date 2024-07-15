import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { username, question, answer } = event;

  const params = {
    TableName: "SecurityQuestions",
    Item: {
      username: username,
      question: question,
      answer: answer,
    },
  };

  try {
    const command = new PutCommand(params);
    await ddbDocClient.send(command);
    return {
      statusCode: 200,
      body: "Security questions stored successfully!",
    };
  } catch (error) {
    console.error("Error storing security questions:", error);
    return {
      statusCode: 400,
      body: error.message,
    };
  }
};
