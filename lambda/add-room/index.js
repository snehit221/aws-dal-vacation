const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const room = JSON.parse(event.body);

    // Generate a unique ID for the room
    const id = uuidv4();

    // Prepare the item to be inserted
    const newItem = {
      ...room,
      amenities: new Set(room.amenities), // Assuming amenities is an array, convert to Set
      id: id,
    };

    // DynamoDB PutCommand parameters
    const params = {
      TableName: "Rooms",
      Item: newItem,
    };

    // Add the room to DynamoDB
    await ddbDocClient.send(new PutCommand(params));

    // Return the generated ID
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Could not add room" }),
    };
  }
};
