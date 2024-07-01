const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const roomId =
      event.queryStringParameters && event.queryStringParameters.roomId;

    if (!roomId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "roomId is required" }),
      };
    }

    const scanParams = {
      TableName: "Reservations",
      ProjectionExpression: "roomId, checkIn, checkOut",
    };

    const data = await ddbDocClient.send(new ScanCommand(scanParams));

    const reservations = data.Items.filter(
      (item) => item.roomId === roomId
    ).map((item) => ({
      checkIn: item.checkIn,
      checkOut: item.checkOut,
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservations }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Could not retrieve reservations" }),
    };
  }
};
