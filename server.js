var WebSocket = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on http://localhost:8080');
});

wsServer = new WebSocket({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);

    console.log((new Date()) + ' Connection accepted.');

    var state = 'idle';

    var pinger = setInterval(function () {
      var ping = {
        type: 'status',
        timestamp: new Date(),
        payload: { state }
      }
      console.log('[server::ping]: %o', ping);
      connection.send(JSON.stringify(ping));
    }, 5000)

    connection.on('message', function(m) {
      console.log('[server::onmessage]: %o', m);
      var message = JSON.parse(m.utf8Data)
      state = message.state || state;
    });

    connection.on('close', function(code, description) {
      console.log('[server::onclose]: %o', code, description);
      clearInterval(pinger);
    });



});
