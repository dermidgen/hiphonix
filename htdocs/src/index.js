import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import './index.css';

import App from './App';
import Splash from './Splash';
import Playback from './Playback';
import Library from './Library';
import Settings from './Settings';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute  component={Splash}/>
      <Route path="/playback" component={Playback}/>
      <Route path="/library" component={Library}>
        <Route path="/library/:id" component={Library}/>
      </Route>
      <Route path="/settings" component={Settings}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
