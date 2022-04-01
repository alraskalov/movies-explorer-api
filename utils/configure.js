const { DB_URL } = process.env;

module.exports = {
  MONGO_URL: DB_URL || 'mongodb://localhost:27017/bitfilmsdb',
  JWT_DEV: 'super-strong-secret',
};
