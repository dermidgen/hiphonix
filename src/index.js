import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link, IndexRoute } from 'react-router'
// import moment from 'moment';
import Socket from './socket';
import './index.css';

const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const socket = new Socket();
window.socket = socket;

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
          <div className="cover"></div>
          <div className="title">title</div>
          <div className="subtitle">subtitle</div>
        </Link>
        <div className="play-pause"><i className="material-icons">play_arrow</i></div>
        <div className="progress-bar"><div></div></div>
      </footer>
    )
  }
}

class Header extends Component {
  openSettings(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  render() {
    return (
      <header>
        <Link id="left" onClick={browserHistory.goBack} className="material-icons">close</Link>
        <span id="title">{this.props.title}</span>
        <i id="volume" className="material-icons">volume_up</i>
        <Link id="settings" to="/settings" className="material-icons">settings</Link>
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
    return (
      <section>
        <Header title="Queue"/>
        <List/>
        <Menu/>
      </section>
    )
  }
}

class List extends Component {
  render() {
    return (
      <ul>
        {[1,2,3].map(item => {
          return <Item key={item} title={`Title ${item}`} subtitle={`Subtitle ${item}`} />;
        })}
      </ul>
    )
  }
}

class Item extends Component {
  render() {
    return (
      <li>
        <div className="icon"></div>
        <div className="title">{this.props.title}</div>
        <div className="subtitle">{this.props.subtitle}</div>
        <a className="action material-icons">play_arrow</a>
      </li>
    )
  }
}

class Library extends Component {
  render() {
    return (
      <section>
        <Header title="Library"/>
        <List/>
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
