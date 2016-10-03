import assert from 'assert';
import MockServer from './server.js';
import Client from './client.js';

describe('Client Unit Test', function() {
  it('Receives status events at 2 Second intervals', function(done) {
    this.timeout(5000);
    var clientApp = new Client();

    setTimeout(() => {
      const messageLen = clientApp.messages.length;
      assert.equal(messageLen, 2, 'Received 2 status events in 5 seconds');
      MockServer.stop();
      done();
    }, 2300);
  });
});
