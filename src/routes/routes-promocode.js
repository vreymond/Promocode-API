// Modules requirement
let express = require('express');
let fetch = require('node-fetch');
let router = express.Router();
let uuidv4 = require('uuid/v4');
let jsonfile = require('jsonfile');

// Files requirement
let logger = require('../lib/logger').logger;


const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=`;
const weatherID = `&appid=d0562f476913da692a065c608d0539f6`;



router.get('/create-promo/:name/:avantage', (req, res) => {
    let promoName = req.params.name;
    let promoAvantage = req.params.avantage;
    // if (!Number.isInteger(promoAvantage)) {
    //     return res.status(400).send('Avantage params must be an integer (percentage reduction)');
    // }
    let age = req.query.age;
    !age ? res.status(400).send("Age query field is required") : true;
    let dateAfter = req.query.dateAfter;
    !dateAfter ? res.status(400).send("dateAfter query field is required") : true;
    let dateBefore = req.query.dateBefore;
    !dateBefore ? res.status(400).send("dateAfter query field is required") : true;
    let meteoStatus = req.query.meteo;
    !meteoStatus ? res.status(400).send("meteo query field is required") : true;
    let meteoTemp = req.query.temp;
    !meteoTemp ? res.status(400).send("temp query field is required") : true;

    let buildPromocode = {
        _id: uuidv4(),
        name: promoName,
        avantage: { percent: promoAvantage},
        restrictions : {}
    }
    
    // Age extract and adding to promo code
    let arrayExtract = age.split(/([0-9]+)/);
    arrayExtract.pop(); // removing last empty element

    let eq = '';
    let lt = '';
    let gt = '';

    for (let i = 0; i < arrayExtract.length; i++) {
        if (arrayExtract[i] === "eq") eq = parseInt(arrayExtract[i+1]);
        if (arrayExtract[i] === "lt") lt = parseInt(arrayExtract[i+1]);
        if (arrayExtract[i] === "gt") gt = parseInt(arrayExtract[i+1]);
    }

    if (lt && !gt || !lt && gt) {
        return res.status(400).send("lt or gt age interval is missing in query");
    }

    if (eq && !lt && !gt) {
        buildPromocode.restrictions["@age"] = { "eq": eq };
        logger.debug(`Age restrictions builded, age only equal to ${eq}`);
    }
    else if (!eq && lt && gt) {
        buildPromocode.restrictions["@age"] = { "lt": lt, "gt": gt};
        logger.debug(`Age restrictions builded, age interval equal to ${gt}-${lt}`);
    }
    else if (eq && lt && gt) {
        buildPromocode.restrictions["@or"] = [
            { 
                "@age": { "eq": eq } 
            },
            {
                "@age": { "lt": lt, "gt": gt}
            } 
        ]
        logger.debug(`Age restrictions builded, age equal to ${eq} and interval equal to ${gt}-${lt}`);
    }

    else {
        return res.status(400).send("Invalid age query, pleaser refer to documentation");
    }

    logger.debug(JSON.stringify(buildPromocode.restrictions))
})

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