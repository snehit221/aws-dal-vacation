// Required modules
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb"); // Correct import for unmarshall
const { google } = require("googleapis");
const sheets = google.sheets("v4");

// Google Sheets and DynamoDB configurations
const SPREADSHEET_ID = '1cS4e_Zsm3xJcCzSRVd1pxE27UihjmkuMetvkKwzXaaM';
const RANGE = 'Sheet1!A1'; // Adjust based on your sheet

// Initialize DynamoDB client
const client = new DynamoDBClient();

// Lambda function handler
exports.handler = async (event) => {
    // Check if DynamoDB NewImage exists in the event
    if (!event.Records || !event.Records[0].dynamodb || !event.Records[0].dynamodb.NewImage) {
        console.error("No NewImage found in the event:", event);
        return;
    }

    try {
        // Extract new record from DynamoDB event and unmarshall it
        const newRecord = unmarshall(event.Records[0].dynamodb.NewImage);

        // Log the new record received from DynamoDB
        console.log("New record from DynamoDB:", newRecord);

        // Append to Google Sheets with the mapped values
        await appendToGoogleSheet(newRecord);
        console.log("Data appended to Google Sheet successfully");
    } catch (error) {
        console.error("Error processing record:", error);
    }
};

// Function to append data to Google Sheets
async function appendToGoogleSheet(values) {
    // Define the column order as per your sheet
    const columnOrder = [
        'userID',
        'name',
        'securityQuestion',
        'securityAnswer',
        'caeserCipherShift',
        'cipherText',
        'role',
        'createdAt',
        'updatedAt'
    ];

    // Map values to match column order and handle missing values
    const updatedValues = columnOrder.map(column => {
        if (values[column]) {
            return values[column];
        } else {
            console.warn(`Missing value for column '${column}'`);
            return ''; // Default to empty string if value is missing
        }
    });

    // Log updated values before appending to Google Sheets
    console.log("Updated values for Google Sheets:", updatedValues);

    // Authenticate with Google Sheets API using service account key
    const auth = new google.auth.GoogleAuth({
        keyFile: "csci-418118-bc809dee4a8a.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    try {
        // Append updatedValues to Google Sheets
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
            valueInputOption: "RAW",
            resource: {
                values: [updatedValues],
            },
        });

        // Log Google Sheets API response
        console.log("Google Sheets API response:", response.data);

    } catch (error) {
        // Handle errors
        console.error("Error appending data to Google Sheet:", error);
        throw error; // Re-throw the error to handle it in the Lambda function's catch block
    }
}
