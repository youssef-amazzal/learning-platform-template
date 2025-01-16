// Question: Pourquoi créer des services séparés ?
// Réponse: 

const { ObjectId } = require('mongodb');
const db = require('../config/db');

// Convert a string ID to an ObjectId
function toObjectId(id) {
  return new ObjectId(id);
}

// Utility functions for MongoDB
async function findOneById(collectionName, id) {
  if (typeof id !== 'string') throw new Error('ID must be a string');

  const collection = (await db.getDb()).collection(collectionName);
  const result = await collection.findOne({ _id: toObjectId(id) });
  return result;
}

async function findAll(collectionName) {
  const collection = (await db.getDb()).collection(collectionName);
  const results = await collection.find({}).toArray();
  return results;
}

async function insertOne(collectionName, document) {
  const collection = (await db.getDb()).collection(collectionName);
  const result = await collection.insertOne(document);
  return result.ops[0];
}

async function updateOneById(collectionName, id, update) {
  if (typeof id !== 'string') {
    throw new Error('ID must be a string');
  }
  const collection = (await db.getDb()).collection(collectionName);
  const result = await collection.updateOne({ _id: toObjectId(id) }, { $set: update });
  return result.modifiedCount > 0;
}

async function deleteOneById(collectionName, id) {
  if (typeof id !== 'string') throw new Error('ID must be a string');

  const collection = (await db.getDb()).collection(collectionName);
  const result = await collection.deleteOne({ _id: toObjectId(id) });
  return result.deletedCount > 0;
}

// Export the services
module.exports = {
  toObjectId,
  findOneById,
  findAll,
  insertOne,
  updateOneById,
  deleteOneById
};