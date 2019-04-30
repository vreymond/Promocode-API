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
    let dateAfter = req.query.end;
    !dateAfter ? res.status(400).send("dateAfter query field is required") : true;
    let dateBefore = req.query.start;
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
    
    /* Age extract and adding to promo code

        This part will verify the age string given in the route query.
        We build the restrictions age part with 3 differents cases:
            - only eq (equal to) value given
            - only lt and gt (lesser than / greater than) value given
            - eq and lt / gt values given
        Others cases return an error to the client.
    */
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


    /* Meteo extracting part and restrictions build
    
    Par manque de temps, je n'ai traité que le cas "gt", il aurait fallu 
    factoriser le code précédent dans une fonction que l'on aurait pu appeller 
    pour la vérification a la fois de l'age et de la météo.
    
    */
   let arrayExtractMeteo = meteoTemp.split(/([0-9]+)/);
   let gtMeteo = '';

   if(arrayExtractMeteo[0] === "eq") gtMeteo = arrayExtractMeteo[1];
  

    buildPromocode.restrictions["@meteo"] = {
        "is": meteoStatus,
        "temp": {
            gt: gtMeteo
        } 
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


getWeather('Lyon')
    .then(results => {
        logger.info(`Retrieve weather from city succeed`);
    })
    .catch(err => {
        logger.error(err);
    })

async function getWeather (city) {

    let res = await fetch(weatherAPI + city + weatherID);
    let weatherJson = res.json();

    return weatherJson;
}



module.exports = router;