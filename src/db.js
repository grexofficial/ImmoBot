import mongoose from 'mongoose';
import uriFormat from 'mongodb-uri';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const mongoURI = process.env.MONGO_DB_URI; // get MONGO_DB_URI environment variable

// check if MONGO_DB_URI exists
if (!mongoURI) {
  throw new TypeError('MONGO_DB_URI environment variable must be provided!');
}

// produce the properly encoded connection string
function encodeMongoURI(urlString) {
  return urlString && uriFormat.format(uriFormat.parse(urlString));
}

// Connect to database using by mongoURI
const connect = () => mongoose
  .connect(encodeMongoURI(mongoURI))
  .then(() => {
    logger.info('Connection to database successful!');
  })
  .catch((err) => logger.error(`Error connecting to database: ${err}`));

// Disconnect to database. Runs .close() on all connections in parallel.
const disconnect = () => mongoose
  .disconnect()
  .then(() => {
    logger.info('Disconnection to database successful!');
  })
  .catch((err) => logger.error(`Error disconnecting to database: ${err}`));

export default { connect, disconnect };
