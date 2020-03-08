import React,{Component} from 'react';
import firebase from 'firebase';
import {Button, Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ClassHeader from '../components/ClassHeader';

class Classroom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            classroom : [],
            currentUser: this.props.user
        };
    }

    componentDidMount = () => {
        firebase.firestore().collection('class')
        .where('teacher_id', '==' , this.state.currentUser.uid).get()
        .then(data =>{
            data.forEach(doc=>{
                this.setState({
                    classroom: [...this.state.classroom,doc]
                })
            })
        })
    }

    render(){
        return (
            <div>
            <ClassHeader user= {this.state.currentUser}/>
            <div className="container">
                <div className="col text-center">
                    <h2>Classroom you have teach</h2>
                </div>
                <hr/>
                <div>
                {this.state.classroom.map((room , index)=> 
                    
                    <div>
                        <Card>
                            <Card.Header>{room.data().classname}</Card.Header>
                            <Card.Body>
                                <Card.Subtitle className="text-muted">{room.data().year}</Card.Subtitle>
                                <Card.Text>
                                    {room.data().description}
                                </Card.Text>
                                <Link to={'/room/'+ room.id}><Button variant="primary">Enter Class</Button></Link>
                            </Card.Body>
                        </Card>
                        <br/>
                    </div>
                )}
                </div>
            </div>
            </div>

        )
    }

}
export default Classroom;