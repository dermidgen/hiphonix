import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'

import API from './api';

import './index.css';

const ws = new WebSocket('ws://localhost:8080', 'echo-protocol');

class App extends Component {

  constructor() {
    super()
    this.state = {
      connection: 'false'
    }
  }

  componentDidMount() {
    ws.onmessage = m => {
      // console.log('[client::onmessage]: %o', m);
      var message = JSON.parse(m.data);
      console.log('[client::onmessage]: %o', message.payload);
      this.setState(message.payload)
    };
    ws.onopen = () => {
      console.info('[client::onopen]:');
      this.setState({
        connection: 'true'
      })
    };
    ws.onerror = e => {
      console.error('[client::onerror]: %o', e);
    };
  }

  render() {
    return (
      <div className="App">
        <header>
          <Link to="/playback">Playback</Link>
          <Link to="/library">Library</Link>
          <Link to="/settings">Settings</Link>
        </header>
        <main>
          {this.props.children}
        </main>
        <footer>
          Version: {process.env.REACT_APP_VERSION},
          API: {API.VERSION},
          Connection: {this.state.connection},
          State: {this.state.state}
        </footer>
      </div>
    );
  }
}

class Playback extends Component {

  play() {
    ws.send(JSON.stringify({ state: 'playing' }));
  }

  pause() {
    ws.send(JSON.stringify({ state: 'paused' }));
  }

  render() {
    return (
      <div>
        <h2>Playback</h2>
        <button onClick={this.play.bind(this)}>Play</button>
        <button onClick={this.pause.bind(this)}>Pause</button>
      </div>
    );
  }
}

class Library extends Component {
  render() {
    return (
      <div>
        <h2>Library {this.props.params.id}</h2>
        <ul>
          <li><Link to="/library/001">001</Link></li>
          <li><Link to="/library/002">002</Link></li>
          <li><Link to="/library/003">003</Link></li>
        </ul>
      </div>
    );
  }
}

class Settings extends Component {
  render() {
    return (
      <div>
        <h2>Settings</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Playback} />
      <Route path="/library" component={Library}>
        <Route path="/library/:id" component={Library}/>
      </Route>
      <Route path="/settings" component={Settings}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
