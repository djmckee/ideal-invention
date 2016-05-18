var mongoose = require('mongoose');

var Migration = new mongoose.Schema({
  refugees: Number,
  total: Number,
  toCountry: String,
  fromCountry: String,
  year: Number
});

module.exports = mongoose.model('Migration', Migration);
