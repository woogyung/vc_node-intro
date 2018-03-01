var express = require('express');

var app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send({
    message: 'hello vanilla'
  });
});

var PORT_NUMBER = 8000;

app.listen(PORT_NUMBER, () => {
  console.log(`Server running at http://127.0.0.1:${PORT_NUMBER}/`);
});

// 1. GET /status-check

// 2. GET /main

// 3. GET ums

// 4. view engine
