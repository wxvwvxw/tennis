import React, { Component } from 'react';
import Home from './Home';
import Score from './Score';
import Canvas from './Canvas';
import './App.css';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Router>
            <div>
              <Route exact path="/" component={Home}/>
              <Route exact path="/game" component={Canvas}/>
              <Route exact path="/score" component={Score}/>
            </div>
          </Router>
      </div>
    );
  }
}

export default App;
