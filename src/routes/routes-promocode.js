// Modules requirement
let express = require('express');
let fetch = require('node-fetch');
let router = express.Router();

// Files requirement
let logger = require('../lib/logger').logger;

const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=`;
const weatherID = `&appid=d0562f476913da692a065c608d0539f6`;



router.post('/ask-promo', (req, res) => {
    let userData = req.body;

    // Checking req.body object sent by user
    let keys = Object.keys(userData);
    if (keys.length !== 2 || !keys.includes('promocode_name') || !keys.includes('arguments')) {
        return res.status(400)
            .send('Invalid request, "promocode_name" and "arguments" keys are required'); 
    }
    let keysArgs = Object.keys(userData.arguments);
    if (keysArgs.length !== 2 || !keysArgs.includes('age') || !keysArgs.includes('meteo')) {
        return res.status(400)
            .send('Invalid arguments parts, "age" and "meteo" keys are required');
    }
    if (!Number.isInteger(userData.arguments.age)) {
        return res.status(400)
            .send('Age value must be an integer')
    }
    let keysMeteo = Object.keys(userData.arguments.meteo);
    if (keysMeteo !== 1 || !keysMeteo.includes('town')) {
        return res.status(400)
            .send('Invalid meteo part, "town" key is required')
    }


    // Checking for restrictions
    


})

// PROMOCODE :
let promocode = {
    _id: '...',
    name: 'WeatherCode',
    avantage: { percent: 20 },
    restrictions: {
        _or: [{
            _age: {
                eq: 40
            }
        }, {
            _age: {
                lt: 30,
                gt: 15
            },
        }],
        _date: {
            after: '2017-05-02',
            before: '2018-05-02',
        },
        _meteo: {
            is: 'clear',
            temp: {
                gt: '15', // Celsius here.
            }
        }
    }
};

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