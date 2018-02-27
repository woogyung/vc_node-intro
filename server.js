// "http" 모듈 수입
var http = require("http");
var url = require('url');
var fs = require('fs');

// 서버 생성 후, 8000번 포트 사용.
// Callback 함수에서 요청과 응답 처리.
http.createServer(function(request, response) {
  response.end(JSON.stringify({
    message: 'hello vanilla'
  }));

  // 1. GET /status-check

  // 2. GET /main

  // 3. GET /top-stories/{SECTION_NAME}

}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
