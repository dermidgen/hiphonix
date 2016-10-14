const debug = require('debug')('hip:server');
const util = require('util');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });
const fixtures = require('./fixtures');

const i = (obj, depth = 1) => {
  return '\n' + util.inspect(obj, { depth, colors: true })
}

const MPD_STATE = {
  STOPPED: 1,
  PLAYING: 2,
  PAUSED: 3,
};

let MPD_STATUS = {
  "type": "state",
  "data": {
    "state": MPD_STATE.STOPPED,
    "volume": -1,
    "repeat": 0,
    "single": 0,
    "crossfade": 0,
    "consume": 0,
    "random": 0,
    "songpos": -1,
    "elapsedTime": 0,
    "totalTime": 235,
    "currentsongid": -1
  }
};

setInterval(function() {
  if (MPD_STATUS.data.state === MPD_STATE.STOPPED) {
    MPD_STATUS.data.elapsedTime = 0;
  }
  if (MPD_STATUS.data.state === MPD_STATE.PLAYING) {
    MPD_STATUS.data.elapsedTime++;
    if (MPD_STATUS.data.elapsedTime >= MPD_STATUS.data.totalTime) {
      MPD_STATUS.data.state = MPD_STATE.STOPPED;
    }
  }
}, 1000);

function setState(cmd, args) {
  switch(cmd) {
    case 'MPD_API_SET_PLAY':
      MPD_STATUS.data.state = MPD_STATE.PLAYING;
    break;
    case 'MPD_API_SET_PAUSE':
      MPD_STATUS.data.state = MPD_STATE.PAUSED;
    break;
    case 'MPD_API_SET_STOP':
      MPD_STATUS.data.state = MPD_STATE.STOPPED;
    break;
    case 'MPD_API_TOGGLE_RANDOM':
      MPD_STATUS.data.random = parseInt(args[0]);
    break;
    case 'MPD_API_TOGGLE_SINGLE':
      MPD_STATUS.data.single = parseInt(args[0]);
    break;
    case 'MPD_API_TOGGLE_REPEAT':
      MPD_STATUS.data.repeat = parseInt(args[0]);
    break;
  }
  return MPD_STATUS;
}

debug('Initializing test server...');

wss.on('connection', connection => {

  debug('Client connection established.');

  const pinger = setInterval(() => {
    try {
      connection.send(JSON.stringify(MPD_STATUS));
    } catch(e) {}
  }, 1000)

  connection.on('message', message => {
    const parts = message.split(',');
    const cmd = parts.shift();
    const args = parts;
    const state = setState(cmd, args);
    const data = fixtures(cmd);
    const response = JSON.stringify(data)

    debug('Message', i({
      message,
      parts,
      cmd,
      args,
      data,
      state,
    }, 3));

    if (data) {
      try {
        connection.send(response);
      } catch(err) {
        console.trace(err);
      }
    }

  });

  connection.on('close', (code, description) => {
    debug('Close', i({ code, description }));
    clearInterval(pinger);
  });

});

debug('Test server Initialized...');

module.exports = wss;
