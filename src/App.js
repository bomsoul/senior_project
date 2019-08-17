import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import Home from './views/Home';
import ImageInput from './views/ImageInput';
import Header from './components/Header';
import TestInput from './views/TestInput';
import cameraFaceDetect from './views/cameraFaceDetect';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={createHistory()}>
          <div className="container">
            <Header/>
            <Route exact path="/" component={Home} />
            <Route path="/photo" component={ImageInput} />
            <Route path="/input" component={TestInput} />
            <Route path="/camera" component={cameraFaceDetect}/>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;