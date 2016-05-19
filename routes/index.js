var express = require('express');
var router = express.Router();

var Year = require('../models/Year.js');
var Country = require('../models/Country.js');
var Migration = require('../models/Migration.js');
var GDPValue = require('../models/GDPValue.js');
var GDPMigrationObject = require('../models/GDPMigrationObject.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    Country.find().sort([['name', 'ascending']]).exec(function(err, countries) {
        if (!err){

            // TODO: Ensure first countries to compare are from Syria to UK!!!
            res.render('index', { title: 'Data in Crisis', countries: countries});

        } else {throw err;}
    });


});

/* GET migration vs GDP data for the user's current selection. */
router.get('/get_data', function(req, res, next) {
    // TODO: Implement some clever stuff.

    var fromCountryId = req.query.fromCountryId;
    var toCountryId = req.query.toCountryId;
    Country.findById(fromCountryId, function (err, fromCountry) {
        Country.findById(toCountryId, function (err, toCountry) {
            // Fetch GDPs...
            GDPValue.find({country: toCountry.name}, function(err, gdpValues) {
                if (!err){
                    // Fetch migration data...

                    Migration.find({toCountry: toCountry.name, fromCountry: fromCountry.name}, function(err, migrationValues) {
                        if (!err){
                            // Stitch together migration and gdp values...
                            var array = [];

                            gdpValues.forEach(function(value){
                                var migrationData = findMigrationForYear(migrationValues, value.year);

                                var refugeeFigure = 0;
                                var migrantTotalFigure = 0;

                                if (migrationData != null) {
                                    refugeeFigure = migrationData.refugees;
                                    migrantTotalFigure = migrationData.total;
                                }

                                var object = new GDPMigrationObject(value.year, refugeeFigure, migrantTotalFigure, value.growth);

                                array.push(object);

                            });

                            res.json(array);

                        } else {
                            throw err;
                        }
                    });

                } else {
                    throw err;
                }
            });
        });
    });

});


function findMigrationForYear(migrations, year) {
    var migration = null;

    migrations.forEach(function(value){
        if (value.year == year) {
            migration = value;
        }
    });

    return migration;
}

module.exports = router;
