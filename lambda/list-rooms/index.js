const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const params = {
    TableName: "Rooms",
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    const rooms = data.Items.map((room) => ({
      ...room,
      amenities: room.amenities?.values() ? [...room.amenities] : [],
      feedback: room.feedback?.values() ? [...room.feedback] : [],
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(rooms),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve rooms" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
