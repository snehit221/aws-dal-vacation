const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const generateReferenceCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
exports.handler = async (event) => {
  try {
    const reservation = JSON.parse(event.body);
    const { userId, roomId, checkIn, checkOut, paid, guests } = reservation;

    if (
      !userId ||
      !guests ||
      !roomId ||
      !checkIn ||
      !checkOut ||
      paid == null
    ) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error:
            "userId, guests, roomId, checkIn, checkOut, and paid are required",
        }),
      };
    }

    const referenceCode = generateReferenceCode();

    // Prepare the item to be inserted into the Reservations table
    const reservationItem = {
      ReferenceCode: referenceCode,
      userId,
      roomId,
      checkIn: new Date(checkIn).toISOString(),
      checkOut: new Date(checkOut).toISOString(),
      guests,
      paid,
    };

    // DynamoDB PutCommand parameters for Reservations table
    const reservationParams = {
      TableName: "Reservations",
      Item: reservationItem,
    };

    // Add the reservation to DynamoDB
    await ddbDocClient.send(new PutCommand(reservationParams));

    // Return the generated reference code
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ referenceCode: referenceCode }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Could not add reservation",
      }),
    };
  }
};
