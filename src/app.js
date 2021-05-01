const express = require('express');
const helmet = require('helmet');//security
const xss = require('xss-clean');//security
const mongoSanitize = require('express-mongo-sanitize');//security
const compression = require('compression');
const cors = require('cors');
const config = require('config');

const routes = require('./api/v1');


const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(
    express.urlencoded({
      extended: true
    })
  );

  
// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
const corsOptions = {
  exposedHeaders: ['x-auth-token'],
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));

app.use('/api/v1', routes);

module.exports = app;
