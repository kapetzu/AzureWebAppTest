const { MongoClient } = require('mongodb');
const { getMongoCredentials } = require('./secrets');

let db;

async function connectToDatabase() {
    const { username, password } = await getMongoCredentials();

    console.log('Successfully retrieved MongoDB credentials');

    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);

    const uri =
      `mongodb+srv://${encodedUsername}:${encodedPassword}@${process.env.MONGODB_HOST2}/?appName=WebAppTestDB`;

    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();

    db = client.db('myWebApp');

    console.log('Database is ready!');

    return client;
}

function getDatabase() {
  if (!db) {
    throw new Error('Database has not been initialized');
  }

  return db;
}

module.exports = {
  connectToDatabase,
  getDatabase
};