// "http" 모듈 수입
var http = require("http");
var url = require('url');
var fs = require('fs');

// 서버 생성 후, 8000번 포트 사용.
// Callback 함수에서 요청과 응답 처리.
http.createServer(function(request, response) {
  const route = url.parse(request.url);

  if (route.path === '/') {
    // 응답 설정
    // 200 status code
    // Content-Type 설정
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');

    // 응답과 함께 보낼 데이터 생성
    let data = {
      name: '내가 nodejs다!!!!',
      date: new Date()
    };

    // object를 string으로 변환
    data = JSON.stringify(data);

    // 데이터와 함께 응답 보내기
    response.end(data);
  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'application/json');

    // 응답과 함께 보낼 데이터 생성
    let data = {
      message: '나가라!!!'
    };

    // object를 string으로 변환
    data = JSON.stringify(data);

    // 데이터와 함께 응답 보내기
    response.end(data);
  }

  // 1. GET /status-check

  // 2. GET /main

  // 3. GET /top-stories/{SECTION_NAME}

}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
