var mongoose = require('mongoose');

var GDPValue = new mongoose.Schema({
  growth: Number,
  country: String,
  year: Number
});

module.exports = mongoose.model('GDPValue', GDPValue);
