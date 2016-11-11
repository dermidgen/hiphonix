import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
// import moment from 'moment';
// import Socket from './socket';
import './index.css';

const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

// const socket = new Socket();
// window.socket = socket;

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
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
  toggleQueue(event) {
    event.preventDefault();
    event.stopPropagation();
    browserHistory.push('/queue');
    console.log('Toggle Queue');
  }
  togglePlayback(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Toggle Playback');
  }
  render() {
    return (
      <footer onClick={ this.toggleQueue.bind(this) }>
        <div className="cover"></div>
        <div className="titles">
          <div className="title">title</div>
          <div className="subtitle">subtitle</div>
        </div>
        <div className="play-pause material-icons" onClick={ this.togglePlayback.bind(this) }>play_arrow</div>
        <div className="progress-bar"><div></div></div>
      </footer>
    )
  }
}

class Header extends Component {
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
        <i id="volume" className="material-icons">volume_up</i>
        {(() => {
          if (this.props.title !== "Settings") {
            return (
              <Link id="settings" to="/settings" className="material-icons">settings</Link>
            );
          }
        })()}
      </header>
    );
  }
}

class App extends Component {
  render() {
    return (
      <main>
        {this.props.children}
        <Controls/>
      </main>
    );
  }
}

class Settings extends Component {
  render() {
    return (
      <section>
        <Header title="Settings"/>
        <form>
          Settings
        </form>
        <Menu/>
      </section>
    )
  }
}

class Queue extends Component {
  render() {
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
    return (
      <section>
        <Header title="Queue"/>
        <List items={ items }/>
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

class Item extends Component {
  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Handling Click');
  }
  render() {
    return (
      <li onClick={ this.handleClick.bind(this) }>
        <div className="icon material-icons">{this.props.icon}</div>
        <div className="titles">
          <div className="title">{this.props.title}</div>
          {(() => {
            if (this.props.subtitle) {
              return (
                <div className="subtitle">{this.props.subtitle}</div>
              );
            }
          })()}
        </div>
        <a className="action material-icons">{this.props.action}</a>
      </li>
    )
  }
}

class Library extends Component {
  render() {
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
    return (
      <section>
        <Header title="Library"/>
        <List items={ items }/>
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
      <Route path="/*" component={Library}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
