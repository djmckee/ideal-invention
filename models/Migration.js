var mongoose = require('mongoose');

var Migration = new mongoose.Schema({
  idp: Number,
  returned_idp: Number,
  stateless: Number,
  others: Number,
  net_idp: Number,
  total: Number,
  country: String,
  year: Number
});

module.exports = mongoose.model('Migration', Migration);
