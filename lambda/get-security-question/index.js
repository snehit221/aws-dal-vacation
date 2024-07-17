import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { username } = JSON.parse(event.body);

  const params = {
    TableName: "SecurityQuestions",
    Key: {
      username: username,
    },
  };

  try {
    const command = new GetCommand(params);
    const response = await ddbDocClient.send(command);
    console.log(response.Item.answers);
    return {
      statusCode: 200,
      body: {
        question: response.Item.question,
        answer: response.Item.answer,
      },
    };
  } catch (error) {
    console.error("Error retrieving security questions:", error);
    return {
      statusCode: 400,
      body: error.message,
    };
  }
};
