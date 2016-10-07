import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router'

import API from './api';
import './index.css';

const api = new API();

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <Link to="/settings"><Icon name="settings" /></Link>
        </header>
        <main>
          {this.props.children}
          <Debugger/>
        </main>
        <Controls />
      </div>
    );
  }
}

class Debugger extends Component {
  constructor(props) {
    super(props)
    this.state = {
      player: {
        version: process.env.REACT_APP_VERSION
      },
      socket: null,
      ping: null
    }
  }
  componentDidMount() {
    api.on('state', payload => {
      this.setState({
        ping: {
          timestamp: new Date(),
          payload
        }
      });
    });
    api.on('connected', () => {
      this.setState({
        socket: 'open'
      });
    });
    api.on('disconnected', () => {
      this.setState({
        socket: 'closed'
      });
    });
  }
  render() {
    return (
      <div className="debugger">
        <div><strong>Debug:</strong> {}</div>
        <pre>
          {JSON.stringify(this.state, null, 2)}
        </pre>
      </div>
    );
  }
}

class Controls extends Component {
  constructor(props) {
    super(props)
    this.browse.bind(this);
    this.play.bind(this);
    this.pause.bind(this);
    this.volume.bind(this);
  }
  browse() {
    // ws.send('setState,browse');
  }
  play() {
    // ws.send('setState,playing');
  }
  pause() {
    // ws.send('setState,paused');
  }
  volume() {
    // ws.send('setState,volume');
  }
  render() {
    return (
      <footer>
        <Icon name="list" onClick={this.browse} />
        <Icon name="play_arrow" onClick={this.play} />
        <Icon name="pause" onClick={this.pause} />
        <Icon name="volume_up" onClick={this.volume} />
      </footer>
    );
  }
}

class Icon extends Component {
  render() {
    return (
      <i {...this.props} className="material-icons">{this.props.name}</i>
    );
  }
}

class Settings extends Component {
  constructor() {
    super();
    this.scan.bind(this);    
    api.on('networks', (message) => {
      console.log('NETWORKS', message.data);
      this.setState({
        networks: message.data,
      });
    });
  }
  scan() {
    api.command('NET_LIST',[]);
  }
  componentDidMount() {
    this.setState({
      networks: [],
    });
  }
  render() {
    var networks = (this.state && typeof this.state.networks !== undefined) ? this.state.networks : [];
    return (
      <div className="settings">
        <h2>Settings</h2>
        <h3>Wifi Connection</h3>
        <select>
          {networks.map((name,index) => { return <option key={index}>{name}</option>; })}
        </select>
        <button onClick={this.scan}>Scan</button>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/settings" component={Settings}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
