var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

var fixtures = {
  STATE: require('./fixtures/STATE.json'),
  MPD_API_GET_OUTPUTS: require('./fixtures/MPD_API_GET_OUTPUTS.json'),
  MPD_API_GET_BROWSE: require('./fixtures/MPD_API_GET_BROWSE.json'),
  MPD_API_SEARCH: require('./fixtures/MPD_API_SEARCH.json'),
};

wss.on('connection', function(connection) {
  console.log((new Date()) + ' Connection accepted.');

  var state = 'idle';

  var pinger = setInterval(function () {
    console.log('[server::state]: %o', fixtures.STATE);
    connection.send(JSON.stringify(fixtures.STATE));
  }, 2000)

  var parseCommand = function(message) {
    var parts =  message.split(',');
    return {
      cmd: parts.shift(),
      args: parts,
    };
  };

  var runCommand = function(cmd) {
    try {
      console.log('[server::command]:', cmd);
      connection.send(JSON.stringify(fixtures[cmd.cmd]));
    } catch(err) {
      console.trace(err);
    }
  };

  connection.on('message', function(m) {
    console.log('[server::onmessage]: %s', m);
    runCommand(parseCommand(m));
  });

  connection.on('close', function(code, description) {
    console.log('[server::onclose]: %s', code, description);
    clearInterval(pinger);
  });

});

module.exports = wss;
