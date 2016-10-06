import assert from 'assert';
import WebSocket from 'ws';
import API from '../../src/api';
import Server from '../server';

global.WebSocket = WebSocket;

describe('API Library', function() {

  it('Loads properly', function() {
    assert.equal(API === undefined, false);
  });

});
