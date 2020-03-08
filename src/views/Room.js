import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from '../components/Header';
import Home from './Home';
import ImageInput from './ImageInput';
import cameraFaceDetect from './cameraFaceDetect';
import AddCode from './AddCode';
import Edit from '../views/Edit';

class Room extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        console.log(this.props.match.params.id);
    }
    render(){
        return (
            <Router>
                <React.Fragment>
                    <Header id={this.props.match.params.id}/>
                    <div className="container">
                    <Switch>
                        <Route exact path="/room/:classid" component={Home}/>
                        <Route path="/photo/:classid" component={ImageInput}/>
                        <Route path="/camera/:classid" component={cameraFaceDetect}/>
                        <Route path="/addstudent/:classid" component={AddCode} />
                        <Route path="/edit/:id" component={Edit} classid={this.props.match.params.id}/>
                    </Switch>
                    </div>
                </React.Fragment>
            </Router>
        )
    }
}
export default Room;