// Modules requirement
let program = require('commander');
let express = require('express');

// Files requirement
let logger = require('./lib/logger').logger;
let setLogLevel = require('./lib/logger').setLogLevel;

// Commands options manager
program
    .version('0.0.1')
    .option('-l, --loglevel <logLevel', 'Set log level', setLogLevel)
    .parse(process.argv);