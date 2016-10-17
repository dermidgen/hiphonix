import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Router, Route, browserHistory, Link } from 'react-router'
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
// import Divider from 'material-ui/Divider';
// import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import PlaylistPlay from 'material-ui/svg-icons/av/playlist-play';
// import ActionInfo from 'material-ui/svg-icons/action/info';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import SongIcon from 'material-ui/svg-icons/image/music-note';
import Album from 'material-ui/svg-icons/av/album';
import Slider from 'material-ui/Slider';
// import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
// import Paper from 'material-ui/Paper';
// import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
// import FontIcon from 'material-ui/FontIcon';
// import SwipeableViews from 'react-swipeable-views';

// const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
// const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
// const nearbyIcon = <IconLocationOn />;

// import API from './api';
import Socket from './socket';
import './index.css';

const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const socket = new Socket();

class PlayHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      elapsed: "00:00",
      total: "00:00",
    };
    socket.on('state', (message) => {
      let position = parseFloat((Math.round((message.data.elapsedTime/message.data.totalTime)*100)/100).toFixed(2));
      // let position = (moment.duration(message.data.elapsedTime, 'seconds')/10000);
      // console.log(`pos: ${pos}`);
      let elapsed = new Date(null);
      let total = new Date(null)
      elapsed.setSeconds(message.data.elapsedTime);
      total.setSeconds(message.data.totalTime);
      console.log(`position: ${position}`);
      this.setState({
        position,
        elapsed: elapsed.toISOString().substr(14, 5),
        total: total.toISOString().substr(14, 5),
      });
    });
  }
  render() {
    return (
      <div className="playhead">
        <div className="position">{ this.state.elapsed }</div>
        <div className="slider">
          <Slider defaultValue={this.state.position} />
        </div>
        <div className="length">{ this.state.total }</div>
      </div>
    )
  }
}

const muiTheme = getMuiTheme({
  palette: {
    canvasColor: 'rgba(19, 23, 27, 1)',
    primary1Color: 'rgba(223, 224, 228, 1)',
    textColor: 'rgba(223, 224, 228, 1)',
  },
  appBar: {
    // height: 50,
  },
});

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
              <div className="song">Song Title</div>
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
    this.setState({
      showVolume: !this.state.showVolume
    });
    // socket.command('MPD_API_SET_VOLUME',[]);
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
          <i onClick={this.volume.bind(this)} className="volume material-icons">volume_up</i>
          <div className="volumeSlider" style={{ display: (this.state.showVolume ? 'block' : 'none') }}>
            <Slider
              defaultValue={0}
              axis="y"
              style={{height: 100}}
              onDragStop={this.volume.bind(this)}
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

class Search extends Component {
  constructor(props) {
    super(props);
    this.search.bind(this);
    socket.on('search', (message) => {
      this.setState({
        items: message.data,
      });
    });
  }
  search() {
    console.log('SEARCH');
    socket.command('MPD_API_SEARCH',[]);
  }
  componentDidMount() {
    this.setState({
      items: [],
    });
  }
  render() {
    // Setup our list of items in the library path
    // TODO: possibly add icon classname to the item
    let items = (this.state && typeof this.state.items !== undefined) ? this.state.items : [];
    items = items.map(function(item) {
      if (item.type === 'song') {
        item.name = item.title;
      } else if (item.type === 'directory') {
        item.name = item.dir;
      } else if (item.type === 'playlist') {
        item.name = item.plist;
      }
      return item;
    });
    return (
      <div className="search">
        <input type="text" id="query"/> <button onClick={this.search}>Search</button>
        <div>Results:</div>
        {
          items.map((item,index) => {
            if (item.type === 'directory') return <Link key={index} to={ `/library/${ item.dir }` }>{item.type}: {item.name}</Link>;
            else return <li key={index}>{item.type}: {item.name}</li>;
          })
        }
      </div>
    );
  }
}

class Library extends Component {
  constructor(props) {
    super(props);

    // socket.on('browse', (message) => {
    //   this.setState({
    //     items: message.data,
    //   });
    // });

    this.setState({
      items: [],
    });

    this.items = (this.state && typeof this.state.items !== undefined) ? this.state.items : [];
    this.items = this.items.map(function(item) {
      if (item.type === 'song') {
        item.name = item.title;
      } else if (item.type === 'directory') {
        item.name = item.dir;
      } else if (item.type === 'playlist') {
        item.name = item.plist;
      }
      return item;
    });

    // {
    //   this.items.map((item,index) => {
    //     if (item.type === 'directory') return <Link key={index} to={ `/library/${ item.dir }` } onClick={this.browse}>{item.type}: {item.name}</Link>;
    //     else return <li key={index}>{item.type}: {item.name}</li>;
    //   })
    // }

  }
  render() {
    return (
      <article className="browser">
        <header>
          <div>
            <Link to={this.props.history.goBack}>
              <i className="material-icons">arrow_back</i>
            </Link>
          </div>
          <div>
            { this.props.title }
          </div>
          <div>
            <Link to="/">
              <i className="material-icons">close</i>
            </Link>
          </div>
        </header>
        <main>
          <List className="list">
            <Subheader>{this.props.location.pathname}</Subheader>
            <ListItem
              leftIcon={<FileFolder />}
              rightIcon={<ChevronRight />}
              primaryText="A folder"
              secondaryText="20 Items"
            />
            <ListItem
              leftIcon={<PlaylistPlay />}
              rightIcon={<ChevronRight />}
              primaryText="My Favorite Playlist"
              secondaryText="100 Items"
            />
            <ListItem
              leftIcon={<SongIcon />}
              rightIcon={<PlayArrow />}
              primaryText="A song item"
              secondaryText="2:40 Seconds"
            />
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
