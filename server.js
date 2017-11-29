// Express 모듈 수입
var express = require('express');

// 서버 생성
var app = express();

// Routing 설정
app.get('/', function(req, res) {
  // 응답과 함께 보낼 데이터 생성
  var data = {
    name: 'vanilla coding nodejs server',
    date: new Date()
  };

  // 데이터와 함께 응답 보내기
  res.status(200).json(data);
});

// 포트 8000 사용
app.listen(8000, function() {
  console.log('Server running at http://127.0.0.1:8000/');
});
