const debug = require('debug')('hip:server');
const util = require('util');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });
const fixtures = require('./fixtures');

const i = (obj, depth = 1) => {
  return '\n' + util.inspect(obj, { depth, colors: true })
}

debug('Initializing test server...');

wss.on('connection', connection => {

  debug('Client connection established.');

  const pinger = setInterval(() => {
    const data = fixtures('STATE');
    connection.send(JSON.stringify(data));
  }, 2000)

  connection.on('message', message => {
    const parts = message.split(',');
    const cmd = parts.shift();
    const args = parts;
    const data = fixtures(cmd);
    const response = JSON.stringify(data)

    debug('Message', i({
      message,
      parts,
      cmd,
      args,
      data
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
