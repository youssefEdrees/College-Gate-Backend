const express = require('express');
const helmet = require('helmet');//security
const xss = require('xss-clean');//security
const mongoSanitize = require('express-mongo-sanitize');//security
const compression = require('compression');
const cors = require('cors');
//const config = require('config');

const routes = require('./api/v1');
const { response } = require('express');
const statusMessageError = require('./utils/statusMessageError');


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


// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  var response = {
    status : err.status,
    message : err.message
  };
  
  if (Number(err.code) == Number(11000)){
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const field = Object.keys(err.keyValue)[0];
    response.message = `Duplicate field: ${field} value: ${value}. Please use another value!`;
    response.status = 400;
  }
  
  console.log(response.status);
  if (typeof response.status == 'undefined'){
    response.status = 400
  }
  res.status(response.status).json(response);
});

module.exports = app;
