import React, { Component } from 'react';
import { store } from '../firebase/firebase';
import {Card, Button,Form } from 'react-bootstrap';

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name : '',
            stdId: '',
            imageURL: '',
            classId: '',
        }
        this.onNameChange = this.onNameChange.bind(this);
        this.onStdIdChange = this.onStdIdChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        store.collection('student').doc(this.props.match.params.id).get()
        .then(doc =>{
            this.setState({
                name : doc.data().name,
                stdId: doc.data().stdId,
                imageURL: doc.data().imageURL,
                classid: doc.data().classid
            })
        })
    }

    onNameChange(e){
        this.setState({ 
            name: e.target.value
        })
    }

    onStdIdChange(e){
        this.setState({ 
            stdId: e.target.value
        })
    }

    onSubmit(e){
        e.preventDefault();
        store.collection('student').doc(this.props.match.params.id)
        .update({
            name : this.state.name,
            stdId: this.state.stdId,
            imageURL: this.state.imageURL,
        })
        .then(() =>{
            alert("Edit Success");
            window.location.href = "/room/"+this.state.classid;
        })
    }

    render(){
        return (
            <CardComponent  student={this.state} 
                            onSubmit={this.onSubmit} 
                            onNameChange={this.onNameChangr}
                            onStdIdChange={this.onStdIdChange}/>
        )
    }
}
export default Edit;

const CardComponent = props =>(
    <Card>
        <Card.Img variant="top" src={props.student.imageURL} />
        <Card.Body>
        <Card.Text>
        <Form onSubmit={props.onSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Fullname:</Form.Label>
                <Form.Control type="text" onChange={props.onNameChange} value={props.student.name} placeholder="Enter your fullname" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Student ID:</Form.Label>
                <Form.Control type="text" onChange={props.onStdIdChange} value={props.student.stdId} placeholder="Enter your Student ID" />
            </Form.Group>

            <Button variant="success" type="submit">
                Submit
            </Button>
            </Form>
        </Card.Text>
        </Card.Body>
    </Card>
)