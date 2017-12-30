// Express 모듈 수입
var express = require('express');

// 서버 생성
var app = express();

app.get('/', function (req, res) {
  const data = {
    name: '내가 nodejs다!!!',
    timestamp: new Date()
  };

  res.status(200).json(data);
});

// 포트 8000 사용
app.listen(8000, function() {
  console.log('Server running at http://127.0.0.1:8000/');
});

// 1. GET /status-check

// 2. GET /main

// 3. GET /top-stories/{SECTION_NAME}
