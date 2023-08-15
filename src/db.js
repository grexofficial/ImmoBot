import mongoose from 'mongoose';
import uriFormat from 'mongodb-uri';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const mongoURI = process.env.MONGO_DB_URI; // get MONGO_DB_URI environment variable

// check if BOT_TOKEN exists
if (!mongoURI) {
  throw new TypeError('MONGO_DB_URI environment variable must be provided!');
}

// produce the properly encoded connection string
function encodeMongoURI(urlString) {
  return urlString && uriFormat.format(uriFormat.parse(urlString));
}

// mongoose connection details and configs
export default () => mongoose
  .connect(encodeMongoURI(process.env.MONGO_DB_URI))
  .then(() => {
    logger.info('Connection to database successful!');
  })
  .catch((err) => logger.error(`Error connecting to database: ${err}`));
