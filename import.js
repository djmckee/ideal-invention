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


            var newMigration = {year: migrationYear, refugees: migration.refugees, total: migration.total, toCountry: countryName, fromCountry: fromName};
            console.log('Adding migration to database: ' + JSON.stringify(newMigration));

            var promise = Migration.create(newMigration);

            promise.then(function (obj) {
                console.log('Added migration to database: ' + JSON.stringify(obj));
            });

        });

    }
};
