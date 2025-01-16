// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :
const db = require('../config/db');
// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl) {
  // TODO: Implémenter une fonction générique de cache
  const client = db.getRedisClient();
  await client.set(key, JSON.stringify(data), 'EX', ttl);
}

async function getCachedData(key) {
  const client = db.getRedisClient();
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

async function deleteCachedData(key) {
  const client = db.getRedisClient();
  await client.del(key);
}

module.exports = {
  // TODO: Exporter les fonctions utilitaires
  cacheData,
  getCachedData,
  deleteCachedData
};