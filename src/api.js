// Modules requirement
let program = require('commander');
let express = require('express');

// Files requirement
let logger = require('./lib/logger').logger;
let setLogLevel = require('./lib/logger').setLogLevel;
let routesPromo = require('./routes/routes-promocode');

let app = express();

// Commands options manager
program
    .version('0.0.1')
    .option('-p, --portAPI <portAPI>', 'Set API port listening')
    .option('-l, --loglevel <logLevel', 'Set log level', setLogLevel)
    .parse(process.argv);


program.portAPI ? portAPI = program.portAPI : portAPI = 3000;


logger.info(`***** Starting Promocode API *****`);

app.listen(portAPI, () => logger.info(`Server listening on port ${portAPI} \n`));

// Simple log that show the date and the route requested
app.use((req, res, next) => {
    logger.debug(`${new Date().toString()} => ${req.originalUrl}`, req.body);
    next();
})
app.use(express.static('public'));
// Replace body-parser in express 4.16+
app.use(express.json());
app.use(routesPromo);