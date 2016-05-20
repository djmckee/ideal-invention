# ideal-invention
A charity hackathon project tying together migration and GDP data.

This project attempts to predict which countries may face a refugee crisis in the future by looking at IDP figure change year on year, and rank countries into 'at risk' and 'improving' categories.

Uses data from [The World Bank](http://www.worldbank.org/)

Hosted live at [https://dataincrisis.ml/](https://dataincrisis.ml/)

Created by [Dylan McKee](http://dylan.ninja), [Alex Birch](https://twitter.com/alex_birch1) and [Nic Flynn](https://twitter.com/im_nic) at the NETV Digital Catapult & Sunderland Software City Charity Data Hackathon.

### Requirements
- [NodeJS](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Chart.js](http://www.chartjs.org/)
- A whole host of NPM dependencies as defined in the `package.json` file - a run of `sudo npm install` in the directory you clone this into should do the trick.

`node app.js --import` imports the data from the CSV files into MongoDB.
