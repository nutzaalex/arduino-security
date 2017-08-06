const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');

const app = express();

const temperature = [];

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/temperature', function(req, res) {
  res.json(temperature);
});

app.post('/temperature', function(req, res) {
  const temp = parseFloat(req.body.temp, 10);
  res.setHeader('Content-Type', 'application/json');

  if (Number.isNaN(temp)) {
    res.json({ success: false, error: 'Not a number!' });
  } else {
    res.json({ success: true, error: null });
    temperature.push({
      value: temp,
      timestamp: Date.now(),
    });
  }
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
