import React, { Component } from 'react';

import './styles.css';

class Splash extends Component {
  render() {
    return (
      <main id="splash">
        HiPhonix Music Player
        <br/>
        Version: {process.env.REACT_APP_VERSION}
      </main>
    );
  }
}

export default Splash;
