var fs = require('fs');
var parse = require('csv-parse/lib/sync');
var Set = require("collections/set");

var Year = require('./models/Year.js');
var Country = require('./models/Country.js');
var Migration = require('./models/Migration.js');
var GDPValue = require('./models/GDPValue.js');

let MIN_GDP_YEAR = 1960;
let MAX_GDP_YEAR = 2014;

module.exports = {
    import: function() {
        // Import idp.csv into MongoDB...
        var idpCsvData = fs.readFileSync("idp.csv");
        var idpDataParse = parse(idpCsvData, {columns: true});
        console.log(idpDataParse);

        var yearsArray = [];
        var countryNames = [];

        // Iterate through the migration data
        for (var i = 0; i < idpDataParse.length; i++) {
            var migration = idpDataParse[i];
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

        idpDataParse.forEach(function(migration){
            var migrationYearString = migration.year;
            var migrationYear = Number(migrationYearString);
            var countryName = migration.country;
            var idp = Number(migration.idp);
            var stateless = Number(migration.stateless);
            var others = Number(migration.others);
            var returnedIdp = Number(migration.returned_idp);
            var netIdp = Number(migration.net_idp);
            var total = Number(migration.total_refugee_population);

            var newMigration = {
              idp: idp,
              returned_idp: returnedIdp,
              stateless: stateless,
              others: others,
              net_idp: netIdp,
              total: total,
              country: countryName,
              year: migrationYear
            };
            console.log('Adding migration to database: ' + JSON.stringify(newMigration));

            var promise = Migration.create(newMigration);

            promise.then(function(obj) {
                console.log('Added migration to database: ' + JSON.stringify(obj));
            });
        });

        /*
        // Import gdp.csv and migration.csv into MongoDB...
        var gdpCsvData = fs.readFileSync("gdp.csv");
        var migrationCsvData = fs.readFileSync("migration.csv");

        var gdpDataParse = parse(gdpCsvData, {columns: true});
        console.log(gdpDataParse);

        var migrationDataParse = parse(migrationCsvData, {columns: true});
        //console.log(migrationDataParse);

        var yearsArray = [];
        var countryNames = [];

        // Iterate through the migration data
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
            var idp = migration.idp;
            var returnedIdp = migration.returned_idp;

            var newMigration = {year: migrationYear, refugees: migration.refugees, idp: , total: migration.total, toCountry: countryName, fromCountry: fromName};
            console.log('Adding migration to database: ' + JSON.stringify(newMigration));

            var promise = Migration.create(newMigration);

            promise.then(function(obj) {
                console.log('Added migration to database: ' + JSON.stringify(obj));
            });

        });

        var gdpYears = [];
        for (var i = MIN_GDP_YEAR; i <= MAX_GDP_YEAR; i++) {
            gdpYears.push(i);
        }

        // And add GDP to database....
        gdpDataParse.forEach(function(gdp){
            let gdpCountryName = gdp["country name"];
            gdpYears.forEach(function(year){
                var stringYear = String(year);
                var yearFigureString = gdp[stringYear];
                var yearGrowthNumber = Number(yearFigureString);
                var gdpValue = {year: year, country: gdpCountryName, growth: yearGrowthNumber};
                var promise = GDPValue.create(gdpValue);

                promise.then(function(obj) {
                    console.log('Added gdp to database: ' + JSON.stringify(obj));
                });
            });

        });
        */

    }
};
