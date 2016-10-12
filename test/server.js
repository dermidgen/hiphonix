import { Server } from 'mock-socket';
import util from 'util';
import fixtures from '../htdocs/test/fixtures';

function MockServer() {
  const mockServer = new Server('ws://localhost:8080');
  mockServer.on('connection', server => {
    setInterval(() => {
      mockServer.send(JSON.stringify(fixtures('STATE')));
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
      mockServer.send(JSON.stringify(fixtures(cmd.cmd)));
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
