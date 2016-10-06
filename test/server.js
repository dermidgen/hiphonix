var wss = require('websocket').server;
var http = require('http');

var fixtures = {
  STATE: require('./fixtures/STATE.json'),
  MPD_API_GET_OUTPUTS: require('./fixtures/MPD_API_GET_OUTPUTS.json'),
  MPD_API_GET_BROWSE: require('./fixtures/MPD_API_GET_BROWSE.json'),
  MPD_API_SEARCH: require('./fixtures/MPD_API_SEARCH.json'),
};

var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on http://localhost:8080');
});

var wsServer = new wss({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', function(request) {
  var connection = request.accept('echo-protocol', request.origin);

  console.log((new Date()) + ' Connection accepted.');

  var state = 'idle';

  var pinger = setInterval(function () {
    console.log('[server::state]: %o', fixtures.STATE);
    connection.send(JSON.stringify(fixtures.STATE));
  }, 2000)

  var parseCommand = function(message) {
    let parts =  message.split(',');
    return {
      cmd: parts.shift(),
      args: parts,
    };
  };

  var runCommand = function(cmd) {
    try {
      connection.send(JSON.stringify(fixtures[cmd.cmd]));
    } catch(err) {
      console.trace(err);
    }
  };

  connection.on('message', function(m) {
    console.log('[server::onmessage]: %o', m);
    runCommand(parseCommand(m));
  });

  connection.on('close', function(code, description) {
    console.log('[server::onclose]: %o', code, description);
    clearInterval(pinger);
  });

});

module.exports = wsServer;
