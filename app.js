require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const alienRouter = require('./routes/aliens');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Environment variables
const port = process.env.PORT || 9000;
const uri = process.env.MONGO_URI || "mongodb://username:password@cbit-shard-00-00.xfxma.mongodb.net:27017,cbit-shard-00-01.xfxma.mongodb.net:27017,cbit-shard-00-02.xfxma.mongodb.net:27017/?ssl=true&replicaSet=atlas-h48f84-shard-0&authSource=admin&retryWrites=true&w=majority&appName=cbit";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect and ping MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit if there's a connection error
  }
}

// Connect to MongoDB
connectToDatabase();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // HTTP request logging

// Routes
app.use('/aliens', alienRouter);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  try {
    await client.close();
    console.log('MongoDB connection closed.');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
