var express = require('express');

var app = express();

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    title: '나만 좋아하고 있었다니..',
    message: '서운하군요...',
    user: {
      name: '허근행'
    }
  });
});

var PORT_NUMBER = 8000;

app.listen(PORT_NUMBER, () => {
  console.log(`Server running at http://localhost:${PORT_NUMBER}/`);
});

// 1. GET /status-check

// 2. GET /main

// 3. GET ums

// 4. view engine
