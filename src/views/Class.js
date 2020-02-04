import React,{Component} from 'react';
import { Route, Switch,BrowserRouter as Router,Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import Home from '../views/Home';
import ImageInput from '../views/ImageInput';
import Header from '../components/Header';
//import TestInput from './views/TestInput';
import cameraFaceDetect from '../views/cameraFaceDetect';
import AddData from '../views/AddData';

class Class extends Component{
  constructor(props){
    super(props)
  }

    render(){
        return(
          <Router>
          <Switch>
              <Route path='/home' component={Home}/>
              <Route path='/image' component={ImageInput}/>
              <Route path='/camera' component={cameraFaceDetect}/>
              <Route path='/addstudent' component={AddData}/>
          </Switch>
      </Router>
        )
    }
}
export default Class;