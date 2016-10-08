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
        <div className="player-background"></div>
        <header>
          <Link to="/settings">
            <i className="material-icons">settings</i>
          </Link>
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
  prev() {
    socket.command('MPD_API_SET_PREV',[]);
  }
  play() {
    socket.command('MPD_API_SET_PLAY',[]);
  }
  next() {
    socket.command('MPD_API_SET_NEXT',[]);
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
        <Link to="/library">
          <i className="material-icons">list</i>
        </Link>
        <i onClick={this.pause} className="material-icons">pause</i>
        <i onClick={this.prev} className="material-icons">skip_previous</i>
        <i onClick={this.play} className="material-icons">play_arrow</i>
        <i onClick={this.next} className="material-icons">skip_next</i>
        <i onClick={this.volume} className="material-icons">volume_up</i>
      </footer>
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
          <strong>Settings</strong>
          <div><strong>Wifi Connection</strong></div>
          <div>
            {networks.map((name,index) => { return <option key={index}>{name}</option>; })}
          </div>
          <button onClick={this.scan}>Scan</button>
        </div>
      </div>
    );
  }
}

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="library">
        <div>
          <strong>Library</strong>
          <div><Link to="/">Close</Link></div>
          <div><Link to="/library">/library</Link></div>
          <div><Link to="/library/path/to/somewhere">/library/path/to/somewhere</Link></div>
          {this.props.params.splat}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/settings" component={Settings}/>
      <Route path="/library*" component={Library}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
