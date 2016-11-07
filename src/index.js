import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
// import AppBar from 'material-ui/AppBar';
// import IconMenu from 'material-ui/IconMenu';
// import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import VolumeUpIcon from 'material-ui/svg-icons/av/volume-up';
import LibraryMusicIcon from 'material-ui/svg-icons/av/library-music';
// import {List, ListItem} from 'material-ui/List';
// import FileFolder from 'material-ui/svg-icons/file/folder';
// import PlaylistPlay from 'material-ui/svg-icons/av/playlist-play';
// import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
// import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
// import SongIcon from 'material-ui/svg-icons/image/music-note';
// import Slider from 'material-ui/Slider';
// import TextField from 'material-ui/TextField';
// import moment from 'moment';
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

// overlay
// menu
//   item
//     icon
//     title
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
class Controls extends Component {
  render() {
    return (
      <footer>
        <Link to="/queue">
          Controls
        </Link>
      </footer>
    )
  }
}

// header
//   left actions
//     left arrow
//   title
//   right actions
//     more actions
//     volume
//     settings
class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <main>
          {this.props.children}
          <Controls/>
          {/* <Menu/> */}
        </main>
      </MuiThemeProvider>
    );
  }
}

class Settings extends Component {
  render() {
    return (
      <form>
        <Toolbar style={{ backgroundColor: 'transparent' }}>
          <ToolbarGroup firstChild={true}>
            <IconButton onClick={this.props.history.goBack}>
              <i className="material-icons">close</i>
            </IconButton>
            <ToolbarTitle text="Settings" />
          </ToolbarGroup>
          <ToolbarGroup>
            <Link to="/">
              <IconButton>
                <i className="material-icons">volume_up</i>
              </IconButton>
            </Link>
            <Link to="/settings">
              <IconButton>
                <i className="material-icons">settings</i>
              </IconButton>
            </Link>
          </ToolbarGroup>
        </Toolbar>
        <ul>
          Settings
        </ul>
      </form>
    )
  }
}

class Queue extends Component {
  render() {
    return (
      <section>
        <Toolbar style={{ backgroundColor: 'transparent' }}>
          <ToolbarGroup firstChild={true}>
            <Link to="/">
              <IconButton>
                <i className="material-icons">close</i>
              </IconButton>
            </Link>
            <ToolbarTitle text="Queue" />
          </ToolbarGroup>
          <ToolbarGroup>
            <Link to="/">
              <IconButton>
                <VolumeUpIcon/>
              </IconButton>
            </Link>
            <Link to="/settings">
              <IconButton>
                <SettingsIcon/>
              </IconButton>
            </Link>
          </ToolbarGroup>
        </Toolbar>
        <ul>
          QUeue
        </ul>
      </section>
    )
  }
}

// Lists items (folders, playlists)
//   icon
//   title
//   subtitle
//   action
// song items
//   subtitle
class Library extends Component {
  render() {
    return (
      <section>
        <Toolbar style={{ backgroundColor: 'transparent' }}>
          <ToolbarGroup firstChild={true}>
            <Link to="/">
              <IconButton>
                <LibraryMusicIcon/>
              </IconButton>
            </Link>
            <ToolbarTitle text="Library" />
          </ToolbarGroup>
          <ToolbarGroup>
            <Link to="/">
              <IconButton>
                <VolumeUpIcon/>
              </IconButton>
            </Link>
            <Link to="/settings">
              <IconButton>
                <SettingsIcon/>
              </IconButton>
            </Link>
          </ToolbarGroup>
        </Toolbar>
        <ul>
          Library
        </ul>
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
      <Route path="/*" component={Library}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
