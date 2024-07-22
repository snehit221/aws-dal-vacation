const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const room = JSON.parse(event.body);
    const { id } = room;

    if (!id) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Room ID is required" }),
      };
    }

    const updateParams = {
      TableName: "Rooms",
      Key: { id: id },
      UpdateExpression: `set
        #number = :number,
        #price = :price,
        #type = :type,
        #subtype = :subtype,
        #hotel = :hotel,
        #maxGuests = :maxGuests,
        #location = :location,
        #amenities = :amenities`,
      ExpressionAttributeNames: {
        "#number": "number",
        "#price": "price",
        "#type": "type",
        "#subtype": "subtype",
        "#hotel": "hotel",
        "#maxGuests": "maxGuests",
        "#location": "location",
        "#amenities": "amenities",
      },
      ExpressionAttributeValues: {
        ":number": room.number,
        ":price": room.price,
        ":type": room.type,
        ":subtype": room.subtype,
        ":hotel": room.hotel,
        ":maxGuests": room.maxGuests,
        ":location": room.location,
        ":amenities": new Set(room.amenities), // Assuming amenities is an array, convert to Set
      },
      ReturnValues: "UPDATED_NEW",
    };

    const updateResult = await ddbDocClient.send(
      new UpdateCommand(updateParams)
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateResult.Attributes),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Could not update room" }),
    };
  }
};
