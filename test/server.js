import { Server } from 'mock-socket';

function MockServer() {
  const mockServer = new Server('ws://localhost:8080');
  mockServer.on('connection', server => {
    setInterval(() => {
      mockServer.send('{ type: "status", data: "" }');
    }, 2000);
  });

  this.stop = function() {
    mockServer.stop();
  }
}

module.exports = new MockServer();
