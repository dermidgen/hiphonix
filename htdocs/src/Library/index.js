import React, { Component } from 'react';
import { Link } from 'react-router'

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

export default Library;
