// Modules requirement
let express = require('express');
let fetch = require('node-fetch');
let router = express.Router();

// Files requirement
let logger = require('../lib/logger').logger;

const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=`;
const weatherID = `&appid=d0562f476913da692a065c608d0539f6`;


getWeather('Lyon')
    .then(results => {
        logger.info(`Retrieve weather from city succeed`);
    })
    .catch(err => {
        logger.error(err);
    })

async function getWeather (city) {
    console.log(weatherAPI + city + weatherID)
    let res = await fetch(weatherAPI + city + weatherID);
    let weatherJson = res.json();

    return weatherJson;
}



module.exports = router;