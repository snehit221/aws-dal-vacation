const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const payload = JSON.parse(event.body);

  console.log(payload);

  switch (payload.queryResult.intent.displayName) {
    case "navigation":
      /**
       * @type {string}
       */
      const navigation = payload.queryResult.parameters?.navigation.trim();

      let navigationInstruction = "";
      if (navigation.includes("login")) {
        navigationInstruction =
          'On the top right corner, click on "Login", Provide your username and password, answer security question and solve the caesor cipher.';
      } else if (
        navigation.includes("signup") ||
        navigation.includes("register")
      ) {
        navigationInstruction = `On the top right corner, click on "Signup". Provide your details name, email, password and select your role either you want to be property agent or customer. Select security question and answer and caesor cipher key. Make sure you remember that key.`;
      } else if (navigation.includes("book") && navigation.includes("room")) {
        navigationInstruction = `Visit room you are interested to book, select number of guest and check-in check-out dates. Check the final price and click on Reserve.`;
      } else if (navigation.includes("feedback")) {
        navigationInstruction = `Visit the room you have booked. There will be a green box where you can provide a feedback.`;
      }

      if (navigationInstruction) {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fulfillmentText: navigationInstruction,
          }),
        };
      }

      break;
    case "get-reservation":
      let response = "Sorry, reference code seems invalid";

      /**
       * @type {number}
       */
      const referenceCode = payload.queryResult.parameters?.["reference-code"];

      const item = await ddbDocClient.send(
        new GetCommand({
          TableName: "Reservations",
          Key: {
            ReferenceCode: referenceCode,
          },
        })
      );

      if (item.Item) {
        const roomParams = {
          TableName: "Rooms",
          Key: {
            id: item.Item.roomId,
          },
        };

        const roomData = await ddbDocClient.send(new GetCommand(roomParams));

        const roomDetails = roomData.Item;

        const checkIn = new Date(item.Item.checkIn);
        const checkOut = new Date(item.Item.checkOut);

        response = `Your room at ${
          roomDetails.location
        } is booked from ${checkIn.getDate()}/${checkIn.getMonth()}/${checkIn.getFullYear()} to ${checkOut.getDate()}/${checkOut.getMonth()}/${checkOut.getFullYear()} for $${
          item.Item.paid
        }. There should be total ${item.Item.guests} guest.`;
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fulfillmentText: response,
        }),
      };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fulfillmentText:
        "Sorry I was not able to interpret the response please try again.",
    }),
  };
};
