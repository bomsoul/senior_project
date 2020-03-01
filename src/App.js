import React, { Component } from 'react';
import { Route,BrowserRouter as Router, Link,Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Login from './views/Login';
import SignUp from './views/SignUp';
import Home from './views/Home';
import ImageInput from './views/ImageInput';
import cameraFaceDetect from './views/cameraFaceDetect';
import AddData from './views/AddData';

class App extends Component {
  render() {
    return (
      <div className="container">
        <Router>
          <Switch>
            <Route exact path='/' component={Login}/>
            <Route path='/signup' component={SignUp}/>
            <Route path='/home' component={Home}/>
            <Route path='/image' component={ImageInput}/>
            <Route path='/camera' component={cameraFaceDetect}/>
            <Route path='/addstudent' component={AddData}/>
          </Switch>
        </Router>
      </div>
    )
  }
}
export default App;