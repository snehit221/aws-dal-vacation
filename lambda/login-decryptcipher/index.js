import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
const ddbClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(ddbClient);

const caesarDecrypt = (str, key) => {
  return str
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - key + 26) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 - key + 26) % 26) + 97);
      }
      return char;
    })
    .join("");
};

export const handler = async (event) => {
  const { username, word, decryptedWord } = JSON.parse(event.body);
  let response = "";
  let statusCode = 0;
  const tableName = "SecurityQuestions";

  try {
    const user = await dynamo.send(
      new GetCommand({
        TableName: tableName,
        Key: {
          username: username,
        },
      })
    );

    if (user.Item) {
      const key = parseInt(user.Item.key, 10);
      const decrypted = caesarDecrypt(word, key);

      if (decrypted === decryptedWord) {
        statusCode = 200;
        response = "Auth successful";
      } else {
        statusCode = 403;
        response = "Decrypt failed:";
      }
    } else {
      response = "User not found";
      statusCode = 404;
    }
  } catch (error) {
    response = `Third factor authentication failed: ${error.message}`;
    statusCode = 500;
  }

  const responseBody = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: response,
  };
  return responseBody;
};
