function Client() {
  const chatSocket = new WebSocket('ws://localhost:8080');
  this.messages = [];

  chatSocket.onmessage = (event) => {
    this.messages.push(event.data);
  };

  this.MPD_API_BROWSE = function() {

  };
}

module.exports = Client;
