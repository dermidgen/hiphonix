import { EventEmitter } from 'events';

const host = 'ws://localhost:8080/ws';
const protocol = 'echo-protocol';

class Socket extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.open();
  }

  close() {
    if (this.ws) this.ws.close();
  }

  send(...args) {
    console.log(args);
    // if (this.ws) this.ws.send('nothing');
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
}

module.exports = Socket;
