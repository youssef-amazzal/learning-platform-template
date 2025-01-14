// Question: Pourquoi créer des services séparés ?
// Réponse: 

const { ObjectId } = require('mongodb');
const db = require('../config/db');

// Fonctions utilitaires pour MongoDB
async function findOneById(collectionName, id) {
  // TODO: Implémenter une fonction générique de recherche par ID
  if (typeof id !== 'string') throw new Error('ID must be a string');

  const collection = db.getDb().collection(collectionName);
  const result = await collection.findOne({ _id: new ObjectId(id) });
  return result;
}

async function findAll(collectionName) {
  const collection = db.getDb().collection(collectionName);
  const results = await collection.find({}).toArray();
  return results;
}

async function insertOne(collectionName, document) {
  const collection = db.getDb().collection(collectionName);
  const result = await collection.insertOne(document);
  return result.ops[0];
}

async function updateOneById(collectionName, id, update) {
  if (typeof id !== 'string') {
    throw new Error('ID must be a string');
  }
  const collection = db.getDb().collection(collectionName);
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
  return result.modifiedCount > 0;
}

async function deleteOneById(collectionName, id) {
  if (typeof id !== 'string') throw new Error('ID must be a string');

  const collection = db.getDb().collection(collectionName);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

// Export des services
module.exports = {
  // TODO: Exporter les fonctions utilitaires
  findOneById,
  findAll,
  insertOne,
  updateOneById,
  deleteOneById
};