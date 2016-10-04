import assert from 'assert';
import Server from './server.js';
import Client from './client.js';

const client = new Client();

describe('WebSocket Service Tests', function() {
  it('MPD_API_GET_OUTPUTS', (done) => {
    client.once('outputnames', () => { done(); });
    client.MPD_API_GET_OUTPUTS();
  });

  it('MPD_API_GET_BROWSE', (done) => {
    client.once('browse', () => { done(); });
    client.MPD_API_GET_BROWSE();
  });

  it('MPD_API_SEARCH', (done) => {
    client.once('search', () => { done(); });
    client.MPD_API_SEARCH();
  });

  it('Receives state events', function(done) {
    client.once('state', () => { done(); });
  });

  after(() => {
    Server.stop();
  })
});
