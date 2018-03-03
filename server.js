var express = require('express');

var app = express();

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.post('/signup', function (req, res) {
  res.send({
    message: '회원 가입!'
  });
});

app.post('/login', function (req, res) {
  res.send({
    message: '로그인!'
  });
});

var PORT_NUMBER = 8000;

app.listen(PORT_NUMBER, () => {
  console.log(`Server running at http://localhost:${PORT_NUMBER}/`);
});

// 1. Signup

// 2. Database
//    - Mongoose
//    - Database Schema Design

// 3. Login

// 4. Json Web Tokens - JWT

// 5. Middlewares
