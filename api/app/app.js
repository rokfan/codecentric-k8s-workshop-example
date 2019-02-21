const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const wfc = require('./wfc');
const app = express();

const httpStatusNotFound = 404;
const httpStatusInternalServerError = 500;

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', function(req, res) {
    res.json({
      request_uuid: uuid.v4(),
      time: new Date().toISOString(),
      env: process.env,
    });
});

app.use((req, res, next) => {
  const status = httpStatusNotFound;
  const err = new Error(status.toString());
  err.status = status;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || httpStatusInternalServerError);
  res.json({error: err});
});

module.exports = app;
