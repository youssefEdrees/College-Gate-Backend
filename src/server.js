const mongoose = require('mongoose');
const app = require('./app');
const config = require('config');

let server;
const port = config.get('PORT') || 3000;
const ip = config.get('IP');
mongoose.connect(config.get('db_shubra'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
    server = app.listen(port,() => {
    console.log(`Listening to port ${port}`);
    });
  }).catch(err => {
    console.log('Error: ', err);
  });
  
  
const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  
  const unexpectedErrorHandler = error => {
    console.error(error);
    exitHandler();
  };
  
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
  