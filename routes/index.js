var express = require('express');
var router = express.Router();
var Set = require("collections/set");

var Year = require('../models/Year.js');
var Country = require('../models/Country.js');
var Migration = require('../models/Migration.js');
var GDPValue = require('../models/GDPValue.js');
var GDPMigrationObject = require('../models/GDPMigrationObject.js');

let YEAR_DELTA = 2;
let LATEST_YEAR = 2014;
let INITIAL_YEAR = LATEST_YEAR - YEAR_DELTA;

/* GET home page. */
router.get('/', function(req, res, next) {
    Country.find({}, function(err, countries) {
        Migration.find({year: INITIAL_YEAR}, function(err, fromYears) {
            Migration.find({year: LATEST_YEAR}, function(err, toYears) {
                    var idpScores = [];

                    var max = 1;
                    var min = 0;

                    countries.forEach(function(country) {
                        var idpData = {};

                        idpData.name = country.name;
                        idpData.id = country._id;

                        var idpScore = 0.0;


                        var currentMigrationData = getMigrationForCountry(toYears, country.name);
                        var prevMigrationData = getMigrationForCountry(fromYears, country.name);

                        if (currentMigrationData && prevMigrationData) {
                            idpScore = (currentMigrationData.net_idp - prevMigrationData.net_idp);

                        } else {
                            idpData.noData = true;
                        }

                        if (idpScore > max) {
                            max = idpScore;
                        }

                        if (idpScore < min) {
                            min = idpScore;
                        }


                        idpData.score = idpScore;

                        idpScores.push(idpData);
                    });

                    idpScores.forEach(function(score) {
                        if (score.score > 0) {
                            score.score = (score.score / max);
                        } else {
                            score.score = (score.score / (min * -1));
                        }
                    });

                    var data = [];
                    for (var i = 0; i < idpScores.length; i++) {
                        var score = idpScores[i];
                        if (!score.noData) {
                            data.push(score);
                        }
                    }

                    idpScores = data;

                    idpScores = idpScores.sort(function(a, b) {
                        return b.score - a.score;
                    });


                    //res.json(idpScores);


                    res.render('index', { title: 'Data in Crisis', idpScores: idpScores});

            });
        });
    });


});

/* GET migration vs GDP data for the user's current selection. */
router.get('/get_data', function(req, res, next) {
    // TODO: Implement some clever stuff.

    Country.find({}, function(err, countries) {
        Migration.find({year: INITIAL_YEAR}, function(err, fromYears) {
            Migration.find({year: LATEST_YEAR}, function(err, toYears) {
                    var idpScores = [];

                    var max = 1;
                    var min = 0;

                    countries.forEach(function(country) {
                        var idpData = {};

                        idpData.name = country.name;
                        idpData.id = country._id;

                        var idpScore = 0.0;


                        var currentMigrationData = getMigrationForCountry(toYears, country.name);
                        var prevMigrationData = getMigrationForCountry(fromYears, country.name);

                        if (currentMigrationData && prevMigrationData) {
                            idpScore = (currentMigrationData.net_idp - prevMigrationData.net_idp);

                        } else {
                            idpData.noData = true;
                        }

                        if (idpScore > max) {
                            max = idpScore;
                        }

                        if (idpScore < min) {
                            min = idpScore;
                        }


                        idpData.score = idpScore;

                        idpScores.push(idpData);
                    });

                    idpScores.forEach(function(score) {
                        if (score.score > 0) {
                            score.score = (score.score / max);
                        } else {
                            score.score = (score.score / (min * -1));
                        }
                    });

                    var data = [];
                    for (var i = 0; i < idpScores.length; i++) {
                        var score = idpScores[i];
                        if (!score.noData) {
                            data.push(score);
                        }
                    }

                    idpScores = data;

                    idpScores = idpScores.sort(function(a, b) {
                        return b.score - a.score;
                    });


                    res.json(idpScores);
            });
        });
    });

});

function getMigrationForCountry(countries, countryName) {
    var data = null;

    countries.forEach(function(item){
        if (item.country == countryName) {
            data = item;
        }
    });

    return data;

}

module.exports = router;
