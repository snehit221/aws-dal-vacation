const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const { roomId, userId, feedback } = JSON.parse(event.body);

    if (!roomId || !userId || !feedback) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "roomId, userId, and feedback are required",
        }),
      };
    }

    const updateParams = {
      TableName: "Rooms",
      Key: { id: roomId },
      UpdateExpression:
        "SET feedback = list_append(if_not_exists(feedback, :empty_list), :feedback)",
      ExpressionAttributeValues: {
        ":feedback": [{ userId, feedback }],
        ":empty_list": [],
      },
      ReturnValues: "UPDATED_NEW",
    };

    const result = await ddbDocClient.send(new UpdateCommand(updateParams));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatedAttributes: result.Attributes }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Could not update room with feedback" }),
    };
  }
};
