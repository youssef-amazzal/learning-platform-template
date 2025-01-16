const { MongoClient } = require('mongodb');
const redis = require('redis');
require('dotenv').config();

let mongoClient;
let db;
let redisClient;

async function connectMongo() {
  if (!mongoClient) {
    try {
      mongoClient = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      await mongoClient.connect();
      db = mongoClient.db(process.env.MONGODB_DB_NAME);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }
  return db;
}

async function connectRedis() {
  if (!redisClient) {
    try {
      redisClient = redis.createClient({ url: process.env.REDIS_URI });
      await redisClient.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }
  return redisClient;
}

module.exports = {
  connectMongo,
  connectRedis,
  getMongoClient: () => mongoClient,
  getRedisClient: () => redisClient,
  getDb: () => db
};