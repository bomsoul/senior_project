import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import firebase from 'firebase';

class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            classname: '',
            description: '',
            year: new Date().getFullYear(),
            teacher_id: this.props.user.uid
        }
    }

    onTitleChange = (e) => {
        this.setState({ 
            classname: e.target.value
        })
    }

    onDescChange = (e) => {
        this.setState({ 
            description: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        firebase.firestore().collection('class').add(this.state)
        .then(() => {
            alert ("Class added successfully")
            window.location.href = "/";
            
        })

    }

    render() { 
        return(
            <div className="container">
                <div className="col text-center">
                    <h2>Create New Class</h2>
                </div>
                <hr/>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Title :</Form.Label>
                        <Form.Control onChange={this.onTitleChange} type="text" placeholder="Subject Title" required />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description :</Form.Label>
                        <Form.Control onChange={this.onDescChange} as="textarea" rows="3" placeholder="What is this class about ....." required />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Create Class
                    </Button>
                </Form>

            </div>
        )
    }
}
export default Create;