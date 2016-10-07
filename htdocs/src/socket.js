import { EventEmitter } from 'events';

const hostname = (typeof document !== 'undefined' && document.location) ? document.location.hostname : 'localhost';
const port = (hostname !== 'hiphonix') ? '8080' : document.location.port;
const host = 'ws://' + hostname + ':' + port + '/ws';
const protocol = '';

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
    const ws = this.ws = new WebSocket(host, protocol);
    ws.onmessage = m => {
      // Apparently the server sends empty frames
      if (!m.data) return;

      try {
        var message = JSON.parse(m.data);
        this.emit('message', message);
      } catch(e) {
        console.error('[Socket::onmessage] Error: %o, Message: %o', e, m);
      }
    };
    ws.onopen = () => {
      console.info('[Socket::onopen]');
      this.emit('open', {
        connection: 'true',
      });
    };
    ws.onclose = () => {
      console.info('[Socket::onclose]');
      this.emit('close', {
        connection: 'false',
      });
    };
    ws.onerror = e => {
      console.error('[Socket::onerror]: %o', e);
      this.emit('error', e);
    };
  }

  send(m) {
    this.ws.send(m);
  }
}

module.exports = Socket;
