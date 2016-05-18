var mongoose = require('mongoose');

var Country = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Country', Country);
