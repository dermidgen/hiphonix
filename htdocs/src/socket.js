import { EventEmitter } from 'events';

const hostname = (typeof document !== 'undefined' && document.location) ? document.location.hostname : 'localhost';
const port = (hostname !== 'hiphonix') ? '8080' : document.location.port;
const host = 'ws://' + hostname + ':' + port + '/ws';

class Socket extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.connected = false;
    this.open();
  }

  close() {
    console.log('Socket.close()');
    if (this.ws) this.ws.close();
  }

  open() {
    console.log('Socket.open()');
    this.ws = new WebSocket(host);
    this.ws.onmessage = message => {
      // Apparently the server sends empty frames
      if (!message.data) return;

      try {
        const logState = false;
        const payload = JSON.parse(message.data);
        if (logState) {
          console.groupCollapsed('Socket::message');
          console.log('message: %o', message);
          console.log('payload: %o', payload);
          console.groupEnd();
        }
        this.emit(payload.type, payload.data);
      } catch(error) {
        // console.trace(error);
      }
    };

    this.ws.onopen = () => {
      console.log('Socket::open');
      this.connected = true;
      this.emit('connected');
    };

    this.ws.onclose = state => {
      console.log('Socket::close');
      this.connected = false;
      this.emit('disconnected', state);
      setTimeout(() => {
        this.open();
      }, 3000);
    };

    this.ws.onerror = error => {
      console.error('Socket::error: %o', error);
      this.emit('error', error);
    };

  }

  command(cmd, params) {
    console.groupCollapsed('Socket command received: %o', cmd);
    console.log('Params: %o)', params);
    console.groupEnd();
    const message = ([cmd].concat(params)).join(',');
    this.ws.send(message);
  }

}

module.exports = Socket;
