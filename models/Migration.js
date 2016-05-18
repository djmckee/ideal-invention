var mongoose = require('mongoose');

var Migration = new mongoose.Schema({
  refugees: Number,
  total: Number,
  toCountry: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  fromCountry: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year' }
});

module.exports = mongoose.model('Migration', Migration);
