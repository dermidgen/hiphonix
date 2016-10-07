import assert from 'assert';
import WebSocket from 'ws';
import Server from '../server';

global.WebSocket = WebSocket;

describe('API Library', function() {
  const API = require('../../src/api');

  it('Loads properly', function() {
    assert.equal(API === undefined, false);
  });

  it('Can send command MPD_API_GET_BROWSE and trap event browse', function(done) {
    let api = new API();
    api.on('browse', function(result) {
      assert.equal(result.data.length > 0, true);
      assert.equal(typeof result.data[0].type, 'string');
      assert.equal(typeof result.data[0].uri, 'string');
      assert.equal(typeof result.data[0].duration, 'number');
      assert.equal(typeof result.data[0].title, 'string');
      done();
    });
    api.on('connected', function() {
      api.command('MPD_API_GET_BROWSE',['0','/']);
    });
  });

});
