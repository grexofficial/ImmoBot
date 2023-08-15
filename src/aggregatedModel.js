import mongoose from 'mongoose';

const { Schema, model } = mongoose;
// Model for aggregatedData collection
const schema = new Schema({
  plz: {
    type: Number,
    required: true,
    index: true,
  },
  avgSize: {
    type: Number,
  },
  avgPrice: {
    type: Number,
  },
  count: {
    type: Number,
  },
  countPrivateSeller: {
    type: Number,
  },
  state: {
    type: String,
  },
  location: {
    type: String,
  },
  norooms: {
    type: Number,
  },
  relativeSharePrivateSeller: {
    type: Number,
  },
  date: {
    type: String,
    required: true,
    index: true,
  },
}, { collection: 'aggregatedData', versionKey: false });

export default model('aggregatedData', schema);
