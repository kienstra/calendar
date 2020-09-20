const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  start: { type: String, required: true },
  description: { type: String, required: false },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Event', eventSchema);
