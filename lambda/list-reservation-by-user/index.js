const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const userId =
      event.queryStringParameters && event.queryStringParameters.userId;

    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "userId is required" }),
      };
    }

    const scanParams = {
      TableName: "Reservations",
      ProjectionExpression:
        "ReferenceCode, userId, roomId, checkIn, checkOut, paid, guests",
    };

    const data = await ddbDocClient.send(new ScanCommand(scanParams));

    const reservations = data.Items.filter((item) => item.userId === userId);

    const roomDetailsPromises = reservations.map(async (reservation) => {
      const roomParams = {
        TableName: "Rooms",
        Key: { id: reservation.roomId },
      };

      const roomData = await ddbDocClient.send(new GetCommand(roomParams));
      return {
        ...reservation,
        roomDetails: roomData.Item || {},
      };
    });

    const reservationsWithRoomDetails = await Promise.all(roomDetailsPromises);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservations: reservationsWithRoomDetails }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Could not retrieve reservations and room details",
      }),
    };
  }
};
