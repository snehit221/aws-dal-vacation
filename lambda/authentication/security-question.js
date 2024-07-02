import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: process.env.REGION });

export const handler = async (event) => {
  const { username, password, email, question, answer, shift } = event;

  if (
    !username ||
    !password ||
    !email ||
    !question ||
    !answer ||
    shift === undefined
  ) {
    return {
      statusCode: 400,
      body: "Missing required user details",
    };
  }

  const userParams = {
    TableName: "UserTable",
    Item: {
      userId: { S: username },
      email: { S: email },
      question: { S: question },
      answer: { S: answer },
      cipherText: { S: encryptWithCaesarCipher(password, shift) },
      shift: { N: shift.toString() },
    },
  };

  try {
    await dynamoDbClient.send(new PutItemCommand(userParams));
    return {
      statusCode: 200,
      body: "User details stored in DynamoDB",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};

function encryptWithCaesarCipher(text, shift) {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join("");
}
