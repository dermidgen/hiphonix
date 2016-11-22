import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';
import moment from 'moment';
import Socket from './socket';
import './index.css';

const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const socket = new Socket();
window.socket = socket;

document.addEventListener('gesturestart', e => { e.preventDefault(); });

const muiTheme = getMuiTheme({
  palette: {
    canvasColor: 'rgba(19, 23, 27, 1)',
    primary1Color: 'rgba(223, 224, 228, 1)',
    textColor: 'rgba(223, 224, 228, 1)',
  }
});

class Menu extends Component {
  cancel() {
    console.log('Cancel out of menu');
  }
  render() {
    return (
      <nav>
        <div onClick={this.cancel.bind(this)}></div>
        <ul>
          <li onClick={this.cancel.bind(this)}>Cancel</li>
        </ul>
      </nav>
    )
  }
}

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      playback: {},
      song: {}
    };
    socket.on('state', state => {
      this.setState({ playback: state });
    });
    socket.on('song_change', song => {
      this.setState({ song });
    });

    // bindings
    this.prev = this.prev.bind(this);
    this.play = this.play.bind(this);
    this.next = this.next.bind(this);
    this.pause = this.pause.bind(this);
    // this.togglePlayback = this.togglePlayback.bind(this);
    // this.volume = this.volume.bind(this);
    // this.toggleVolume = this.toggleVolume.bind(this);
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
  toggleQueue(event) {
    event.preventDefault();
    event.stopPropagation();
    browserHistory.push('/queue');
    console.log('Toggle Queue');
  }
  togglePlayback(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Controler.togglePlayback()');
    if (this.state.playing) {
      this.pause();
    } else {
      this.play();
    }
  }
  render() {
    return (
      <footer className="" onClick={ this.toggleQueue.bind(this) }>
        <div className="cover"></div>
        <div className="titles">
          <div className="title">title</div>
          <div className="subtitle">subtitle</div>
        </div>
        <div className="play-pause material-icons" onClick={ this.togglePlayback.bind(this) }>play_arrow</div>
        <div className="progress-bar"><div style={ { width: `${this.state.playback.elapsed}%` } }></div></div>
      </footer>
    )
  }
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: 0
    };
  }
  toggleVolume() {
    event.preventDefault();
    event.stopPropagation();
    const showVolume = !this.state.showVolume;
    console.log('Header.toggleVolume(): %o', showVolume);
    this.setState({ showVolume });
  }
  volume(event, value) {
    console.log('Header.volume(event: %o, value: %o)', event, value);
    if (value) {
      this.setState({
        volume: value
      });
      socket.command('MPD_API_SET_VOLUME',[value]);
    }
  }
  render() {
    return (
      <header>
        {(() => {
          if (this.props.title !== "Library") {
            return (
              <Link id="left" onClick={browserHistory.goBack} className="material-icons">close</Link>
            );
          }
        })()}
        <span id="title">{this.props.title}</span>
        <i id="volume" className="material-icons" onClick={ this.toggleVolume.bind(this) }>volume_up</i>
        {(() => {
          if (this.props.title !== "Settings") {
            return (
              <Link id="settings" to="/settings" className="material-icons">settings</Link>
            );
          }
        })()}
        <div className="volume" style={{ display: (this.state.showVolume ? 'block' : 'none') }}>
          <Slider
            defaultValue={50}
            axis="y"
            style={{height: 100}}
            min={0}
            max={100}
            value={this.state.volume}
            onChange={this.volume.bind(this)}
            onDragStop={this.toggleVolume.bind(this)}
          />
        </div>
      </header>
    );
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <main>
          {this.props.children}
          <Controls/>
        </main>
      </MuiThemeProvider>
    );
  }
}

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networks: []
    };
    socket.on('networks', message => {
      console.log('NETWORKS', message);
      this.setState({
        networks: message,
      });
    });

    // socket.command('NET_LIST',[]);
  }
  componentDidMount() {
    this.setState({
      networks: [],
    });
  }
  setWirelessNetwork() {
    this.setState({
      networks: [],
    });
  }
  setOutputChannel() {
    console.log('Settings.setOutputChannel()');
  }
  setStreamingRate() {
    console.log('Settings.setStreamingRate()');
  }
  render() {
    return (
      <section>
        <Header title="Settings"/>
        <form>
          <SelectField
            floatingLabelText="Wireless Network"
            value={0}
            onChange={this.setWirelessNetwork}
            autoWidth={true}
            >
            {this.state.networks.map((name,index) => {
              return <MenuItem key={index} value={name} primaryText={name} />;
            })}
          </SelectField>
          <TextField
            hintText=""
            floatingLabelText="Network Password"
            type="password"
          />

          <SelectField
            floatingLabelText="Output Channel"
            value={0}
            onChange={this.setOutputChannel}
            autoWidth={true}
            >
            <MenuItem value={0} primaryText="[NOT POPULATED]" />
          </SelectField>
          <Slider />
          <Toggle label="Volume Normalization" />
          <Toggle label="Resampling" />
          <SelectField
            floatingLabelText="Streaming Rate"
            value={0}
            onChange={this.setStreamingRate}
            autoWidth={true}
            >
            <MenuItem value={0} primaryText="[NOT POPULATED]" />
          </SelectField>

          <RaisedButton label="Rescan Networks" fullWidth={true} />
          <RaisedButton label="Install Update" fullWidth={true} />
          <RaisedButton label="Restart Player" fullWidth={true} />
          <RaisedButton label="Reset Player" fullWidth={true} />
        </form>
        <Menu/>
      </section>
    )
  }
}

class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
    socket.on('queue', (items = []) => {
      console.log(`Queue items received: %o`, items);
      this.setState({ items });
    });
  }
  componentWillMount() {
    if (!socket.connected) {
      socket.once('connected', () => {
        this.fetch();
      });
    } else {
      this.fetch();
    }
  }
  componentDidUpdate(props) {
    if (props.params.splat !== this.props.params.splat) {
      this.fetch();
    }
  }
  fetch() {
    socket.command('MPD_API_GET_QUEUE',[0]);
  }
  render() {
    return (
      <section>
        <Header title="Queue"/>
        <List items={ this.state.items }/>
        <Menu/>
      </section>
    )
  }
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
    socket.on('search', (items = []) => {
      console.log(`Search items received: %o`, items);
      this.setState({ items });
    });
  }
  componentWillMount() {
    socket.command('MPD_API_SEARCH',[]);
  }
  render() {
    return (
      <section>
        <Header title="Search"/>
        <List items={ this.state.items }/>
        <Menu/>
      </section>
    )
  }
}

class List extends Component {
  render() {
    return (
      <ul>
        {this.props.items.map((item, index) => {
          return <Item key={index} {...item} />;
        })}
      </ul>
    )
  }
}

class Item extends Component {
  constructor(props) {
    super(props);

    switch (this.props.type) {
      case 'directory':
        this.icon = 'folder';
        this.title = this.props.dir;
        this.action = 'chevron_right';
        break;
      case 'playlist':
        this.icon = 'playlist_play';
        this.title = this.props.plist;
        break;
      default:
        this.icon = 'audiotrack';
        this.title = this.props.title;
        this.subtitle = moment(this.props.duration*1000).format('m:ss')
        this.action = 'play_arrow';
        break;
    }
  }
  play() {
    event.preventDefault();
    event.stopPropagation();
    console.log('Item.play()');
    socket.command('MPD_API_SET_PLAY',[]);
  }
  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Handling Click');
  }
  render() {
    return (
      <li onClick={ this.handleClick.bind(this) }>
        <div className="icon material-icons">{this.icon}</div>
        <div className="titles">
          <div className="title">{this.title}</div>
          {(() => {
            if (this.subtitle) {
              return (
                <div className="subtitle">{this.subtitle}</div>
              );
            }
          })()}
        </div>
        <a className="action material-icons" onClick={ this.play.bind(this) }>{this.action}</a>
      </li>
    )
  }
}

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
    socket.on('browse', (items = []) => {
      console.log(`Library items received: %o`, items);
      this.setState({ items });
    });

    // bindings
    this.title = this.title.bind(this);
  }
  title() {
    // console.group('Library.title()');
    // let parts = null;
    // let title = null;
    // try {
    //   parts = this.props.params.splat.split('/');
    //   title = parts[0] || 'library';
    // } catch (e) {
    //   console.error(e);
    // }
    // console.log('splat: %o', this.props.params.splat);
    // console.log('parts: %o', parts);
    // console.log('title: %o', title);
    // console.groupEnd();
    // return title;
    return 'Library';
  }
  componentWillMount() {
    if (!socket.connected) {
      socket.once('connected', () => {
        this.fetch();
      });
    } else {
      this.fetch();
    }
  }
  componentDidUpdate(props) {
    if (props.params.splat !== this.props.params.splat) {
      // console.log(`this.props.params.splat: ${this.props.params.splat}`);
      this.fetch();
    }
  }
  fetch() {
    let path = (this.props.params.splat || '/').split('/');
    path.shift();
    path = path.join('/');
    if (!path || path === '') path = '/';
    socket.command('MPD_API_GET_BROWSE',[0, path]);
  }
  render() {
    return (
      <section>
        <Header title={ this.title() }/>
        <List items={ this.state.items }/>
        <Menu/>
      </section>
    )
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Library}/>
      <Route path="/settings" component={Settings}/>
      <Route path="/queue" component={Queue}/>
      <Route path="/search" component={Search}/>
      <Route path="/welcome" component={Search}/>
      <Route path="/*" component={Library}/>
    </Route>
  </Router>,
  document.getElementById('root')
);




// REFERENCE
/*


// controls
//   icon
//   title
//   subtitle (duration)
//   play/pause icon
//   progress bar
// full controls
//   progress bar
//   current position
//   total length
//   shuffle icon
//   previous track icon
//   play/pause icon
//   next track icon
//   repeat all/one/none cycle icon


// icons:
//  folder
//  audiotrack
//  playlist_play
//  storage

// actions:
//  more_vert
//  chevron_right

// other
//  repeat
//  shuffle
//  skip_previous
//  skip_next
//  arrow_back
//  wifi
//  volume_up
//  close



var items = [
  {
    icon: 'folder',
    title: 'Folder',
    subtitle: '3 items',
    action: 'chevron_right'
  },
  {
    icon: 'playlist_play',
    title: 'Playlist',
    subtitle: '20 items',
    action: 'chevron_right'
  },
  {
    icon: 'audiotrack',
    title: 'Song',
    subtitle: '0:00',
    action: 'play_arrow'
  },
  {
    icon: 'drag_handle',
    title: 'Draggable Song',
    subtitle: '0:00',
    action: 'play_arrow'
  },
  {
    icon: 'drag_handle',
    title: 'Draggable Song',
    subtitle: '0:00',
    action: 'play_arrow'
  },
  {
    icon: 'drag_handle',
    title: 'Draggable Song',
    subtitle: '0:00',
    action: 'play_arrow'
  },
  {
    icon: 'drag_handle',
    title: 'Draggable Song',
    subtitle: '0:00',
    action: 'play_arrow'
  },
  {
    icon: 'drag_handle',
    title: 'Draggable Song',
    subtitle: '0:00',
    action: 'play_arrow'
  },
  {
    icon: 'drag_handle',
    title: 'Draggable Song',
    subtitle: '0:00',
    action: 'play_arrow'
  },
  {
    icon: 'drag_handle',
    title: 'Draggable Song',
    subtitle: '0:00',
    action: 'play_arrow'
  }
]

var items = [
  {
    icon: 'drag_handle',
    title: 'Song',
    subtitle: '0:00',
    action: 'play_arrow'
  },
  {
    icon: 'drag_handle',
    title: 'Song',
    subtitle: '0:00',
    action: 'play_arrow'
  },
  {
    icon: 'drag_handle',
    title: 'Song',
    subtitle: '0:00',
    action: 'play_arrow'
  },
  {
    icon: 'drag_handle',
    title: 'Song',
    subtitle: '0:00',
    action: 'play_arrow'
  }
]
*/
