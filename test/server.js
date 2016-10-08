const debug = require('debug')('hip:server');
const util = require('util');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });

const i = (obj, depth = 1) => {
  return '\n' + util.inspect(obj, { depth, colors: true })
}

const fixtures = {
  STATE: require('./fixtures/STATE.json'),
  MPD_API_GET_OUTPUTS: require('./fixtures/MPD_API_GET_OUTPUTS.json'),
  MPD_API_GET_BROWSE: require('./fixtures/MPD_API_GET_BROWSE.json'),
  MPD_API_SEARCH: require('./fixtures/MPD_API_SEARCH.json'),
  NET_LIST: require('./fixtures/NET_LIST.json'),
};

debug('Initializing test server...');

wss.on('connection', connection => {

  debug('Client connection established.');

  const pinger = setInterval(() => {
    connection.send(JSON.stringify(fixtures.STATE));
  }, 2000)

  connection.on('message', message => {
    const parts = message.split(',');
    const cmd = parts.shift();
    const args = parts;
    const fixture = fixtures[cmd]
    const response = JSON.stringify(fixture)

    debug('Message', i({
      message,
      parts,
      cmd,
      args,
      fixture,
      response
    }, 3));

    try {
      connection.send(response);
    } catch(err) {
      console.trace(err);
    }

  });

  connection.on('close', (code, description) => {
    debug('Close', i({ code, description }));
    clearInterval(pinger);
  });

});

debug('Test server Initialized...');

module.exports = wss;
