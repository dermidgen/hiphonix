import { Server } from 'mock-socket';

const fixtures = {
  STATE: require('./fixtures/STATE.json'),
  MPD_API_GET_OUTPUTS: require('./fixtures/MPD_API_GET_OUTPUTS.json'),
  MPD_API_GET_BROWSE: require('./fixtures/MPD_API_GET_BROWSE.json'),
  MPD_API_SEARCH: require('./fixtures/MPD_API_SEARCH.json'),
};

function MockServer() {
  const mockServer = new Server('ws://localhost:8080');
  mockServer.on('connection', server => {
    setInterval(() => {
      mockServer.send(JSON.stringify(fixtures.STATE));
    }, 200);
  });

  var parseCommand = (message) => {
    let parts =  message.split(',');
    return {
      cmd: parts.shift(),
      args: parts,
    };
  };

  var runCommand = (cmd) => {
    try {
      mockServer.send(JSON.stringify(fixtures[cmd.cmd]));
    } catch(err) {
      console.trace(err);
    }
  };

  mockServer.on('message', message => {
    runCommand(parseCommand(message));
  });

  this.stop = function() {
    mockServer.stop();
  }
}

module.exports = new MockServer();
