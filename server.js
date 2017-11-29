// "http" 모듈 수입
var http = require("http");

// 서버 생성 후, 8000번 포트 사용.
// Callback 함수에서 요청과 응답 처리.
http.createServer(function(request, response) {
  console.log(request.method);

  // 응답 설정
  // 200 status code
  // Content-Type 설정
  response.writeHead(200, {'Content-Type': 'application/json'});

  // 응답과 함께 보낼 데이터 생성
  var data = {
    name: 'vanilla coding nodejs server',
    date: new Date()
  };

  // object를 string으로 변환
  data = JSON.stringify(data);

  // 데이터와 함께 응답 보내기
  response.end(data);

}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
