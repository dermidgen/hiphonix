import EventEmitter from 'events';
import util from 'util';

// If we're in --live we want to hit a running
// instance of hiphonix server.
if (process.argv.pop() === '--live') {
  var WebSocket = require('ws');
  var url = 'ws://localhost:8080/ws';
} else {
  var Server = require('./server.js');
  var WebSocket = require('mock-socket').WebSocket;
  var url = 'ws://localhost:8080';
}

function Client() {
  EventEmitter.call(this);

  const socket = new WebSocket(url);
  const $this = this;

  socket.onmessage = (event) => {
    if (!event.data) return;
    try {
      var message = JSON.parse(event.data);
      this.emit(message.type, message);
    } catch(err) {
      console.log(event);
      console.trace(err);
    }
  };

  this.send = (message) => {
    try {
      socket.send(message);
    } catch(e) {
      console.trace(e);
    }
  }

  this.MPD_API_GET_OUTPUTS = () => { this.send('MPD_API_GET_OUTPUTS'); };
  this.MPD_API_GET_BROWSE = () => { this.send('MPD_API_GET_BROWSE,0,/'); };
  this.MPD_API_SEARCH = () => { this.send('MPD_API_SEARCH,ice'); };
}
util.inherits(Client, EventEmitter);

module.exports = Client;
