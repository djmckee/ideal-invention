var express = require('express');
var router = express.Router();

var Year = require('../models/Year.js');
var Country = require('../models/Country.js');
var Migration = require('../models/Migration.js');
var GDPValue = require('../models/GDPValue.js');


/* GET home page. */
router.get('/', function(req, res, next) {
    Country.find({}, function(err, countries) {
        if (!err){

            // TODO: Ensure first countries to compare are from Syria to UK!!!
            res.render('index', { title: 'Refugee, migrant and GDP data comparison', countries: countries});

        } else {throw err;}
    });
});

/* GET migration vs GDP data for the user's current selection. */
router.get('/', function(req, res, next) {
    // TODO: Implement some clever stuff.

    res.json({});
});

module.exports = router;
