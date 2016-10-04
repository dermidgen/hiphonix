import EventEmitter from 'events';
import util from 'util';

function Client() {
  const socket = new WebSocket('ws://localhost:8080');
  const $this = this;

  EventEmitter.call(this);

  socket.onmessage = (event) => {
    var message = JSON.parse(event.data);
    this.emit(message.type, message);
  };

  this.MPD_API_GET_OUTPUTS = () => { socket.send('MPD_API_GET_OUTPUTS'); };
  this.MPD_API_GET_BROWSE = () => { socket.send('MPD_API_GET_BROWSE,0,/'); };
  this.MPD_API_SEARCH = () => { socket.send('MPD_API_SEARCH,ice'); };
}
util.inherits(Client, EventEmitter);

module.exports = Client;
