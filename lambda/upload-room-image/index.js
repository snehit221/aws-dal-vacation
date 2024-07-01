const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const parser = require("lambda-multipart-parser");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { Upload } = require("@aws-sdk/lib-storage");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({});
const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

exports.handler = async (event) => {
  console.log(event);
  try {
    const roomId = event.queryStringParameters.roomId;
    if (!roomId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Room ID is required" }),
      };
    }

    const result = await parser.parse(event);

    const fileContent = result.files[0].content;
    const fileName = `${roomId}/${result.files[0].filename}`;

    const s3Params = {
      Bucket: "dalvacation-rooms-dal", // Replace with your S3 bucket name
      Key: fileName,
      Body: fileContent,
    };

    // Upload file to S3 using Upload class
    const upload = new Upload({
      client: s3,
      params: s3Params,
    });

    await upload.done();

    // Construct the file URL
    const fileUrl = `https://${s3Params.Bucket}.s3.amazonaws.com/${fileName}`;

    // Update the room in DynamoDB with the file URL
    const updateParams = {
      TableName: "Rooms",
      Key: { id: roomId },
      UpdateExpression: "set image = :url",
      ExpressionAttributeValues: {
        ":url": fileUrl,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const updateResult = await ddbDocClient.send(
      new UpdateCommand(updateParams)
    );

    // Return the updated room
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
      body: JSON.stringify({ error: "Could not upload file and update room" }),
    };
  }
};
