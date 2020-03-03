import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import auth from './firebase/firebase';
import './App.css';
import Header from './components/Header';
import Signin from './views/Signin';
import SignUp from './views/SignUp';
import Home from './views/Home';
import ImageInput from './views/ImageInput';
import cameraFaceDetect from './views/cameraFaceDetect';
import AddData from './views/AddData';
import Edit from './views/Edit';
import 'antd/dist/antd.css';

var user = auth.currentUser;
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentUser: user
    }
  }

  componentDidMount(){
    auth.onAuthStateChanged(user => {
        if (user) {
          this.setState({
            currentUser: user
          })
        }
    })
}
  render() {
    const {currentUser} = this.state;
    if(currentUser){
      return (
        <div>
        <Router>
          <React.Fragment>
          <Header/>
          <div className="container">
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/photo" component={ImageInput}/>
            <Route path="/camera" component={cameraFaceDetect}/>
            <Route path="/addstudent" component={AddData}/>
            <Route path="/edit/:id" component={Edit}/>
          </Switch>
          </div>
          </React.Fragment>
      </Router>
      </div>
      )
    }
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Signin}/>
          <Route path="/signup" component={SignUp}/>
        </Switch>
      </Router>
    )
  }
}
export default App;