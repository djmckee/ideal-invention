var fs = require('fs');
var parse = require('csv-parse/lib/sync');
var Set = require("collections/set");

var Year = require('./models/Year.js');
var Country = require('./models/Country.js');
var Migration = require('./models/Migration.js');
var GDPValue = require('./models/GDPValue.js');

module.exports = {
    import: function() {
        // Import gdp.csv and migration.csv into MongoDB...
        var gdpCsvData = fs.readFileSync("gdp.csv");
        var migrationCsvData = fs.readFileSync("migration.csv");

        var gdpDataParse = parse(gdpCsvData, {columns: true});
        //console.log(gdpDataParse);


        var migrationDataParse = parse(migrationCsvData, {columns: true});
        //console.log(migrationDataParse);

        var yearsArray = [];
        var countryNames = [];

        for (var i = 0; i < migrationDataParse.length; i++) {
            var migration = migrationDataParse[i];
            var migrationYearString = migration.year;
            var migrationYear = Number(migrationYearString);
            var countryName = migration.country;
            yearsArray.push(migrationYear);
            countryNames.push(countryName);
        }

        var yearsSet = new Set(yearsArray);
        yearsArray = yearsSet.toArray();

        var countrySet = new Set(countryNames);
        countryNames = countrySet.toArray();

        // Years array now only holds uniques
        //console.log(yearsArray);

        // Add unique years to database...
        yearsArray.forEach(function(item){
            Year.create({year: item}, function (err, created) {
                if (err) throw err;
            });
        });

        //console.log(countryNames);
        // Add unique countries to database...
        countryNames.forEach(function(item){
            Country.create({name: item}, function (err, created) {
                if (err) throw err;
            });
        });

        // Add each migration to the databae...
        migrationDataParse.forEach(function(migration){
            var migrationYearString = migration.year;
            var migrationYear = Number(migrationYearString);
            var countryName = migration.country;
            var fromName = migration.origin;


            Year.findOne({ 'year': migrationYear }, '_id', function yearFound(err, matchedYear) {
                if (err) throw err;

                Country.findOne({ 'name': countryName }, '_id', function matchedToCountryFound(err, matchedToCountry) {
                    if (err) throw err;

                    Country.findOne({ 'name': fromName }, '_id', function matchedFromCountryFound(err, matchedFromCountry) {
                        if (err) throw err;

                        if (matchedYear && matchedToCountry && matchedFromCountry) {
                            var newMigration = {year: matchedYear._id, refugees: migration.refugees, total: migration.total, toCountry: matchedToCountry._id, fromCountry: matchedFromCountry._id};

                            Migration.create(newMigration, function migrationInserted (err, obj) {
                                if (err) throw err;
                                console.log('Added migration to database: ' + JSON.stringify(obj));


                            });
                        } else {
                            var newMigration = {year: matchedYear._id, refugees: migration.refugees, total: migration.total, toCountry: matchedToCountry._id, fromCountry: matchedFromCountry._id};

                            var logStr = 'Could not add migration to database: ' + JSON.stringify(newMigration);
                            console.log(logStr);

                            throw {name : "Could not insert migration", message : logStr};
                        }

                    });

                });
            });



        });

    }
};
