import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'

import API from './api';

import './index.css';

let api;

class App extends Component {

  constructor() {
    super()
    api = new API();
    api.on('connected', () => {
      console.info('[client::onopen]:');
      this.setState({
        connection: 'true',
      });
    });
    api.on('disconnected', () => {
      console.info('[client::onclose]:');
      this.setState({
        connection: 'false',
      });
    });
    api.on('error', e => {
      console.error('[client::onerror]: %o', e);
    });
    this.state = {
      connection: 'false',
    };
  }

  componentDidMount() {
    api.on('state', m => {
      this.setState(m.data);
    });
  }

  render() {
    return (
      <div className="App">
        <header>
          <Link to="/playback">Playback</Link>
          <Link to="/library">Library</Link>
          <Link to="/settings">Settings</Link>
          <Icon name="people"/>
          <div>
          Version: {process.env.REACT_APP_VERSION},
          API: {API.VERSION},
          Connection: {this.state.connection},
          State: {this.state.state}
          </div>
        </header>
        <main>
          {this.props.children}
        </main>
        <Controls />

      </div>
    );
  }
}

class Controls extends Component {
  render() {
    return (
      <footer></footer>
    );
  }
}

class Playback extends Component {

  play() {
    api.send(JSON.stringify({ state: 'playing' }));
  }

  pause() {
    api.send(JSON.stringify({ state: 'paused' }));
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

class Icon extends Component {
  render() {
    return (
      <i className="material-icons">{this.props.name}</i>
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
      <Route path="/queue" component={Settings}/>
      <Route path="/queue" component={Settings}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
