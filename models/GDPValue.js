var mongoose = require('mongoose');

var GDPValue = new mongoose.Schema({
  growth: Number,
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year' }
});

module.exports = mongoose.model('GDPValue', GDPValue);
