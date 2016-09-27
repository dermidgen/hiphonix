import React, { Component } from 'react';
import { Link } from 'react-router'

import './styles.css';

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
        <footer>Version: {process.env.REACT_APP_VERSION}</footer>
      </div>
    );
  }
}

export default App;
