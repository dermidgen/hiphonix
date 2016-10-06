import assert from 'assert';
import WebSocket from 'ws';
import Socket from '../../src/socket';
import Server from '../server';

global.WebSocket = WebSocket;

describe('Socket Library', function() {
  let ws = null;

  it('Loads properly', function() {
    assert.equal(Socket === undefined, false);
  });

  it('Emits an event for onopen', function(done) {
    ws = new Socket();
    ws.on('open', function() { done(); });
  });

  it('Emits an event for onclose', function(done) {
    ws = new Socket();
    ws.on('open', function() { ws.close(); });
    ws.on('close', function() { done(); });
  });

  it('Emits an event for onmessage', function() {
    ws = new Socket();
    ws.on('message', function() { done(); });
  });

  it('Emits an event for onerror', function() {
    ws = new Socket();
    ws.on('open', function() { Server.stop(); });
    ws.on('error', function() { done(); });
  });
});
