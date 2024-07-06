const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { LanguageServiceClient } = require('@google-cloud/language');
const googleCredentials = require('./csci-418118-bc809dee4a8a.json'); 

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const tableName = 'Feedback';

// Initialize Google Cloud Natural Language API client with credentials
const gcpClient = new LanguageServiceClient({
  credentials: googleCredentials
});

const analyzeSentiment = async (textContent) => {
  const document = {
    content: textContent,
    type: 'PLAIN_TEXT',
  };

  const [result] = await gcpClient.analyzeSentiment({ document });
  const sentiment = result.documentSentiment;
  const attitude = getAttitude(sentiment.score);

  return {
    score: sentiment.score,
    magnitude: sentiment.magnitude,
    attitude: attitude
  };
};

const getAttitude = (score) => {
  if (score > 0.2) {
    return 'positive';
  } else if (score < -0.2) {
    return 'negative';
  } else {
    return 'neutral';
  }
};

exports.handler = async (event) => {
  try {
    // Scan DynamoDB table
    const params = {
      TableName: tableName,
    };

    const data = await ddbDocClient.send(new ScanCommand(params));
    const items = data.Items;

    // Analyze sentiment for each comment
    const feedbackWithSentiment = await Promise.all(
      items.map(async (item) => {
        const comment = item.comment;
        const sentiment = await analyzeSentiment(comment);
        return {
          ...item,
          sentiment_score: sentiment.score,
          sentiment_magnitude: sentiment.magnitude,
          attitude: sentiment.attitude
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(feedbackWithSentiment),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to analyze sentiment' }),
    };
  }
};
