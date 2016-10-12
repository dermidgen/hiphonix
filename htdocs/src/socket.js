import { EventEmitter } from 'events';

const hostname = (typeof document !== 'undefined' && document.location) ? document.location.hostname : 'localhost';
const port = (hostname !== 'hiphonix') ? '8080' : document.location.port;
const host = 'ws://' + hostname + ':' + port + '/ws';

class Socket extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.open();
  }

  close() {
    if (this.ws) this.ws.close();
  }

  open() {
    this.ws = new WebSocket(host);
    this.ws.onmessage = message => {
      // Apparently the server sends empty frames
      if (!message.data) return;

      try {
        var data = JSON.parse(message.data);
        if (data.type !== 'state') {
          console.groupCollapsed('[Socket::message]: %o', data.type, data.data);
          console.log(message);
          console.groupEnd();
        }
        this.emit(data.type, data);
      } catch(error) {
        console.error('[Socket::message]: %o, %o', error, message);
      }
    };

    this.ws.onopen = () => {
      console.info('[Socket::open]');
      this.emit('connected');
    };

    this.ws.onclose = state => {
      console.info('[Socket::close]');
      this.emit('disconnected', state);
      setTimeout(() => {
        this.open();
      }, 3000);
    };

    this.ws.onerror = error => {
      console.error('[Socket::error]: %o', error);
      this.emit('error', error);
    };

  }

  command(cmd, params) {
    const message = ([cmd].concat(params)).join(',');
    this.ws.send(message);
  }

}

module.exports = Socket;
