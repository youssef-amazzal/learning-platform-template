// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : 
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : 

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo() {
  // TODO: Implémenter la connexion MongoDB
  // Gérer les erreurs et les retries
  try {
    mongoClient = new MongoClient(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

async function connectRedis() {
  // TODO: Implémenter la connexion Redis
  // Gérer les erreurs et les retries
  try {
    redisClient = redis.createClient({ url: config.redis.uri });
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}

// Export des fonctions et clients
module.exports = {
  // TODO: Exporter les clients et fonctions utiles
  connectMongo,
  connectRedis,
  getMongoClient: () => mongoClient,
  getRedisClient: () => redisClient,
  getDb: () => db
};