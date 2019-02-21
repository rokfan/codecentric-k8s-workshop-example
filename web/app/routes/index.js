const express = require('express');
const request = require('request');

const router = express.Router();
const defaultAPIURL = 'http://localhost:3001';
const apiURL = process.env.API_URL || defaultAPIURL;
const apiStatusURL = `${apiURL}/`;

router.get('/', (req, res, next) => {
  const params = { method: 'GET', url: apiStatusURL, json: true };
  request(params, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      const err = new Error(`cannot ${params.method} "${apiStatusURL}"`);
      err.status = 404;
      err.response = response || error;
      next(err);
      return;
    }
    res.render('index', {
      title: 'Kubernetes Workshop Example App',
      request_uuid: body.request_uuid,
      time: body.time,
      env: JSON.stringify(process.env, null, 4),
    });
  });
});

module.exports = router;
