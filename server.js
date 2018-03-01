var http = require('http');
var fs = require('fs');
var request = require('request');

// 1. GET /status-check

// 2. GET /main

// 3. GET /top-stories/{SECTION_NAME}

// 서버 생성 후, 8000번 포트 사용.
// Callback 함수에서 요청과 응답 처리.
http.createServer(function(req, res) {
  console.log(req.url);

  if (req.url === '/' && req.method === 'GET') {
    res.end(JSON.stringify({
      message: 'GET vanilla'
    }));
  } else if (req.url === '/123/123') {
    res.end(JSON.stringify({
      message: 'no good'
    }));
  } else if (req.url === '/' && req.method === 'POST') {
    res.end(JSON.stringify({
      message: 'POST vanilla'
    }));
  } else if (req.url === '/main' && req.method === 'GET') {
    var template = fs.readFileSync('./index.html', {
      encoding: 'utf-8'
    });

    res.end(template);
  } else if (req.url === '/index.js' && req.method === 'GET') {
    var temp = fs.readFileSync('./index.js', {
      encoding: 'utf-8'
    });

    res.end(temp);
  } else {
    res.end(JSON.stringify({
      message: req.url
    }));
  }
}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');











