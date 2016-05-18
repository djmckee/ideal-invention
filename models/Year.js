var mongoose = require('mongoose');

var Year = new mongoose.Schema({
  year: Number
});

module.exports = mongoose.model('Year', Year);
