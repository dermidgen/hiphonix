import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router'

// import API from './api';
import Socket from './socket';
import './index.css';

const socket = new Socket();

class PlayHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0
    };
    this.style = {
      left: `${this.state.position}px`
    }
  }
  render() {
    return (
      <div className="playhead" style={ this.style }>
        <div className="position">2:34</div>
        <div className="slider">
          <div className="background"><div></div></div>
          <div className="foreground"><div></div></div>
          <div className="head"><div></div></div>
        </div>
        <div className="length">4:50</div>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playback: {},
      song: {}
    };
    socket.on('state', message => {
      this.setState({
        playback: message.data
      });
    });
    socket.on('song_change', message => {
      this.setState({
        song: message.data
      });
    });
  }
  render() {
    return (
      <div className="App">
        <div className="player-background" style={{ backgroundImage: (this.state.song.cover) ? `url(${this.state.song.cover})` : `url(images/cover.png)` }}></div>
        <header>
          <Link to="/settings">
            <i className="material-icons">more_vert</i>
          </Link>
        </header>
        <main>
          {this.props.children}
          <div className="track">
            <div className="cover" style={{ backgroundImage: (this.state.song.cover) ? `url(${this.state.song.cover})` : `url(images/cover.png)` }}></div>
            <div className="title">{this.state.song.title || '[title]'}</div>
            <div className="album">{this.state.song.album || '[album]'}</div>
            <div className="artist">{this.state.song.artist || '[artist]'}</div>
            <PlayHead position={this.state.song.position} />
          </div>
        </main>
        <Controls />
      </div>
    );
  }
}

class Controls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playback: {},
      song: {}
    };
    socket.on('state', message => {
      // console.log('STATE', message.data);
      this.setState({
        playback: message.data
      });
    });
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
        <div>
          <Link to="/library"><i className="material-icons">list</i></Link>
        </div>
        <div>
          <i onClick={this.prev} className="prev material-icons">skip_previous</i>
          {(() => {
            if (this.state.playback.state === 2) {
              return (
                <i onClick={this.pause} className="play material-icons">pause</i>
              );
            } else {
              return (
                <i onClick={this.play} className="pause material-icons">play_arrow</i>
              );
            }
          })()}
          <i onClick={this.next} className="next material-icons">skip_next</i>
        </div>
        <div>
          <i onClick={this.volume} className="volume material-icons">volume_up</i>
        </div>

      </footer>
    );
  }
}

class Settings extends Component {
  constructor(props) {
    super(props);
    this.scan.bind(this);
    socket.on('networks', (message) => {
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
          <div><Link to="/">Close</Link></div>
          <div><strong>Wifi Connection</strong></div>
          <div>
            <select>
            {networks.map((name,index) => { return <option key={index}>{name}</option>; })}
            </select>
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
    this.browse.bind(this);
    socket.on('browse', (message) => {
      console.log('BROWSE', message.data);
      this.setState({
        items: message.data,
      });
    });
  }
  browse() {
    socket.command('MPD_API_GET_BROWSE',[0,'/']);
  }
  componentDidMount() {
    this.setState({
      items: [],
    });
    if (socket.state) this.browse();
    else socket.on('connected', () => {
      this.browse();
    });
  }
  render() {
    let items = (this.state && typeof this.state.items !== undefined) ? this.state.items : [];
    items = items.map(function(item) {
      let ret = {};
      if (typeof item.title !== undefined) {
        ret = {
          name: item.title,
          type: 'song',
          data: item,
        };
      } else if (typeof item.dir !== undefined) {
        ret = {
          name: item.dir,
          type: 'dir',
          data: item,
        };
      } else if (typeof item.plist !== undefined) {
        ret = {
          name: item.plist,
          type: 'plist',
          data: item,
        };
      }
      return ret;
    })
    return (
      <div className="library">
        <div>
          <strong>Library</strong>
          <div><Link to="/">Close</Link></div>

          <ul>
          {items.map((item,index) => { return <li key={index}>{item.name}</li>; })}
          </ul>
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
