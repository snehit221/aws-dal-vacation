const functions = require('@google-cloud/functions-framework');
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');


// Initialize Firebase Admin SDK with specific project ID
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)   
  });
}

const firestore = admin.firestore();

functions.cloudEvent('helloPubSub', async (cloudEvent) => {

  const base64data = cloudEvent.data.message.data;
  const messageData = Buffer.from(base64data, 'base64').toString();
  const parsedData = JSON.parse(messageData);

  // Extract data from the parsed message
  const { userId, message, agentId, datetime } = parsedData;

  if (!userId) {
    console.error('Invalid userId:', userId);
    return;
  }

  // Define the Firestore document reference
  const documentRef = firestore.collection('messages').doc(userId);

  try {
    // Use a transaction to ensure consistency
    await firestore.runTransaction(async (transaction) => {
      const doc = await transaction.get(documentRef);
      if (doc.exists) {
        // Update the document with the new message
        transaction.update(documentRef, {
          messages: admin.firestore.FieldValue.arrayUnion({
            message,
            datetime,
          }),
        });
      } else {
        // Create a new document if it doesn't exist
        transaction.set(documentRef, {
          userId,
          agentId,
          messages: [{
            message,
            datetime,
          }],
        });
      }
    });
    console.log('Message processed and saved to Firestore');
  } catch (error) {
    console.error(`Error processing Pub/Sub message: ${error.message}`);
  }
});
