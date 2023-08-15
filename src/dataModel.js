import mongoose from 'mongoose';

const { Schema, model } = mongoose;
// Model for rawdata collection
const schema = new Schema({
  property_type: {
    type: String,
    index: true,
  },
  state: {
    type: String,
  },
  district: {
    type: String,
  },
  postcode: {
    type: Number,
    index: true,
  },
  location: {
    type: String,
    required: true,
  },
  number_of_rooms: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
  },
  estate_size: {
    type: Number,
  },
  isprivate: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, { collection: 'rawdata', versionKey: false });

export default model('rawdata', schema);
