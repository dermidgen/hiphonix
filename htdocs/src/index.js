import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'

import API from './api';

import './index.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <Link to="/">Playback</Link>
          <Link to="/library">Library</Link>
          <Link to="/settings">Settings</Link>
        </header>
        <main>
          {this.props.children}
        </main>
        <footer>Version: {process.env.REACT_APP_VERSION}, API: {API.VERSION}</footer>
      </div>
    );
  }
}

class Playback extends Component {
  render() {
    return (
      <div>
        <h2>Playback</h2>
        <button>play</button>
        <button>pause</button>
      </div>
    );
  }
}

class Library extends Component {
  render() {
    return (
      <div>
        <h2>Library {this.props.params.id}</h2>
        <ul>
          <li><Link to="/library/001">001</Link></li>
          <li><Link to="/library/002">002</Link></li>
          <li><Link to="/library/003">003</Link></li>
        </ul>
      </div>
    );
  }
}

class Settings extends Component {
  render() {
    return (
      <div>
        <h2>Settings</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/">
      <IndexRoute component={App} />
      <Route path="/playback" component={Playback}/>
      <Route path="/library" component={Library}>
        <Route path="/library/:id" component={Library}/>
      </Route>
      <Route path="/settings" component={Settings}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
