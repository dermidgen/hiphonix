import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router'

// import API from './api';
import Socket from './socket';
import './index.css';

const socket = new Socket();

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
    socket.on('STATE', payload => {
      this.setState({
        ping: {
          timestamp: new Date(),
          payload
        }
      });
    });
    socket.on('connected', () => {
      this.setState({
        socket: 'open'
      });
    });
    socket.on('disconnected', () => {
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
    socket.command('MPD_API_GET_BROWSE',[]);
  }
  play() {
    socket.command('MPD_API_SET_PLAY',[]);
  }
  pause() {
    socket.command('MPD_API_SET_PAUSE',[]);
  }
  volume() {
    socket.command('MPD_API_SET_VOLUME',[]);
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
    socket.on('NET_LIST', (message) => {
      console.log('NETWORKS', message.data);
      this.setState({
        networks: message.data,
      });
    });
  }
  scan() {
    socket.command('NET_LIST',[]);
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
        <div>
          <strong>Wifi Connection</strong>
        </div>
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
