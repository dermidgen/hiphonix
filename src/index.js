import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {List, ListItem} from 'material-ui/List';
import FileFolder from 'material-ui/svg-icons/file/folder';
import PlaylistPlay from 'material-ui/svg-icons/av/playlist-play';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import SongIcon from 'material-ui/svg-icons/image/music-note';
import Slider from 'material-ui/Slider';
// import TextField from 'material-ui/TextField';
import moment from 'moment';
import Socket from './socket';
import './index.css';

const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    canvasColor: 'rgba(19, 23, 27, 1)',
    primary1Color: 'rgba(223, 224, 228, 1)',
    textColor: 'rgba(223, 224, 228, 1)',
  }
});

const socket = new Socket();
window.socket = socket;

class PlayHead extends Component {
  constructor() {
    super();
    this.state = {
      elapsedTime: 0,
      totalTime: null
    };
    socket.on('state', state => {
      this.setState(state);
    });
    this.position = this.position.bind(this);
  }
  position(event, value) {
    if (value) {
      console.warn('PlayHead.position unimplemented');
      // set position here somehow
    }
  }
  render() {
    return (
      <div className="playhead">
        <div className="position">{ moment(this.state.elapsedTime*1000).format('m:ss') }</div>
        <div className="slider">
          <Slider
            min={0}
            max={this.state.totalTime || 1}
            value={this.state.elapsedTime}
            />
        </div>
        <div className="length">{ moment(this.state.totalTime*1000).format('m:ss') }</div>
      </div>
    )
  }
}

class Cover extends Component {
  render() {
    return (
      <div className="cover">
        {(() => {
          if (this.props.image) {
            return (
              <div style={{ backgroundImage: `url(${this.props.image})` }}></div>
            );
          } else {
            return (
              <SongIcon style={{
                  width: '100%',
                  height: '100%',
                  color: '#000',
                  opacity: 0.25
              }} />
            );
          }
        })()}
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
    socket.on('state', state => {
      this.setState({
        playback: state
      });
    });
    socket.on('song_change', song => {
      this.setState({ song });
    });
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <div className="bgCover"></div>
          <header>
            <AppBar
              style={{ backgroundColor: 'transparent' }}
              zDepth={0}
              showMenuIconButton={false}
              iconElementRight={
                <IconMenu
                  iconButtonElement={
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
              }
            />
          </header>
          <main>

            <div className="current">
              <Cover image="/images/cover.png" />
              <div className="song">{this.state.song.title || '[Song Title]'}</div>
              <PlayHead position={this.state.song.position} />
            </div>

            {this.props.children}
          </main>
          <footer>
            <Controls/>
          </footer>
        </div>
      </MuiThemeProvider>
    );
  }
}

class Controls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playback: {},
      song: {},
      showVolume: false
    };
    socket.on('state', state => {
      // console.log('STATE', message.data);
      this.setState({
        playback: state
      });
    });
    this.prev = this.prev.bind(this);
    this.play = this.play.bind(this);
    this.next = this.next.bind(this);
    this.pause = this.pause.bind(this);
    this.volume = this.volume.bind(this);
    this.toggleVolume = this.toggleVolume.bind(this);
  }
  prev() {
    console.log('Controler.prev()');
    socket.command('MPD_API_SET_PREV',[]);
  }
  play() {
    console.log('Controler.play()');
    socket.command('MPD_API_SET_PLAY',[]);
  }
  next() {
    console.log('Controler.next()');
    socket.command('MPD_API_SET_NEXT',[]);
  }
  pause() {
    console.log('Controler.pause()');
    socket.command('MPD_API_SET_PAUSE',[]);
  }
  toggleVolume() {
    const showVolume = !this.state.showVolume;
    console.log('Controler.toggleVolume(): %o', showVolume);
    this.setState({ showVolume });
  }
  volume(event, value) {
    console.log('Controler.volume(event: %o, value: %o)', event, value);
    if (value) {
      this.setState({
        volume: value
      });
      socket.command('MPD_API_SET_VOLUME',[value]);
    }
  }
  render() {
    return (
      <div className="controls">
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
          <i onClick={this.toggleVolume} className="volume material-icons">volume_up</i>
          <div className="volumeSlider" style={{ display: (this.state.showVolume ? 'block' : 'none') }}>
            <Slider
              defaultValue={50}
              axis="y"
              style={{height: 100}}
              min={0}
              max={100}
              value={this.state.volume}
              onChange={this.volume}
              onDragStop={this.toggleVolume}
            />
          </div>
        </div>
      </div>
    );
  }
}

class Settings extends Component {
  constructor(props) {
    super(props);
    this.scan.bind(this);
    socket.on('networks', message => {
      console.log('NETWORKS', message);
      this.setState({
        networks: message,
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
    this.state = {
      items: [],
      title: null
    }
    const items = (items = []) => {
      console.log(`items received: %o`, items);
      const sticky = [];
      // if (this.props.params.splat !== 'queue') {
      //   sticky.push({ type: 'directory', dir: 'queue' })
      // }
      this.setState({
        items: sticky.concat(items),
        title: this.title()
      });
    }
    socket.on('browse', items);
    socket.on('search', items);
    socket.on('queue', items);
    this.title = this.title.bind(this);
  }
  title() {
    console.group('Library.title()');
    let parts = null;
    let title = null;
    try {
      parts = this.props.params.splat.split('/');
      title = parts[0] || 'library';
    } catch (e) {
      console.error(e);
    }
    console.log('splat: %o', this.props.params.splat);
    console.log('parts: %o', parts);
    console.log('title: %o', title);
    console.groupEnd();
    return title;
  }
  componentWillMount() {
    if (!socket.connected) socket.once('connected', () => {
      this.fetch();
    });
    else this.fetch();
  }
  componentDidUpdate(props) {
    if (props.params.splat !== this.props.params.splat) {
      // console.log(`this.props.params.splat: ${this.props.params.splat}`);
      this.fetch();
    }
  }
  fetch() {
    // console.log('Library.fetch()');
    // console.log('splat: %o', this.props.params.splat);
    let path = (this.props.params.splat || '/').split('/');
    // console.log('path: %o', path);
    switch (path[0]) {
      case 'queue':
        socket.command('MPD_API_GET_QUEUE',[0]);
        break;
      case 'search':
        socket.command('MPD_API_SEARCH',[]);
        break;
      default:
        path.shift();
        path = path.join('/');
        if (!path || path === '') path = '/';
        socket.command('MPD_API_GET_BROWSE',[0, path]);
    }
  }
  render() {
    return (
      <article className="browser">
        <header>
          <div>
            <Link onClick={this.props.history.goBack}>
              <i className="material-icons">arrow_back</i>
            </Link>
          </div>
          <div>
            <Link to="/library">Library</Link>
          </div>
          <div>
            <Link to="/queue">Queue</Link>
          </div>
          <div>
            <Link to="/">
              <i className="material-icons">close</i>
            </Link>
          </div>
        </header>
        <main>
          <List className="list">
            {this.state.items.map((item,index) => {
              let linkTo = item.dir;
              let path = (this.props.params.splat || '/').split('/');
              const props = {};

              if (item.type === 'song') {
                props.leftIcon = <SongIcon />;
                props.rightIcon = <PlayArrow />;
                props.primaryText = item.title;
                props.onClick = function() {
                  socket.command('MPD_API_ADD_TRACK', [path + '/' + item.title]);
                };
              }

              if (item.type === 'directory') {
                linkTo = '/library/' + item.dir;
                props.leftIcon = <FileFolder />;
                props.rightIcon = <ChevronRight />;
                props.primaryText = item.dir;
              }

              if (item.type === 'playlist') {
                // linkTo = item.plist;
                props.leftIcon = <PlaylistPlay />;
                props.rightIcon = <PlayArrow />;
                props.primaryText = item.plist;
              }

              if (!item.type) {
                props.leftIcon = <SongIcon />;
                props.rightIcon = <PlayArrow />;
                props.primaryText = item.title;
              }
              // console.log(props);
              return (
                <Link to={linkTo} key={index}>
                  <ListItem {...props}/>
                </Link>
              )
            })}
          </List>
        </main>
      </article>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/settings" component={Settings}/>
      <Route path="/*" component={Library}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
