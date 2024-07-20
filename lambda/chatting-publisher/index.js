const functions = require('@google-cloud/functions-framework');
const { PubSub } = require('@google-cloud/pubsub');
const { Firestore } = require('@google-cloud/firestore');
const pubsub = new PubSub();
const firestore = new Firestore();

functions.http('publisher', async (req, res) => {
  const { userId, message, agentId } = req.body;

  // Publish message to Pub/Sub topic
  const topicName = 'messages-topic';
  const dataBuffer = Buffer.from(JSON.stringify({
    userId,
    message,
    agentId,
    datetime: new Date().toISOString()
  }));

  try {
    await pubsub.topic(topicName).publish(dataBuffer);
    res.status(200).send('Message sent to Pub/Sub');
  } catch (error) {
    console.error('Error publishing message to Pub/Sub:', error);
    res.status(500).send('Error publishing message to Pub/Sub');
  }});


