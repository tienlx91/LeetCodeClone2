const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
    if (db) return db;
    await client.connect();
    db = client.db('leetcode-clone'); // Ensure this is the correct database name
    return db;
}

module.exports = { connectDB };