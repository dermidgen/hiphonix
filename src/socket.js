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
        // if (data.type !== 'STATE') {
          console.groupCollapsed('[Socket::message]: %o', data.type, data.data);
          console.log(message);
          console.groupEnd();
        }
        this.emit('message', data);
      } catch(error) {
        console.error('[Socket::message]: %o, %o', error, message);
      }
    };

    this.ws.onopen = () => {
      console.info('[Socket::open]');
      this.emit('open');
    };

    this.ws.onclose = () => {
      console.info('[Socket::close]');
      this.emit('close');
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
