import React, { Component } from 'react';
import axios from 'axios';
import {Card, Button, InputGroup, Form} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import firebase from 'firebase';

class Home extends Component {
  _isMounted = false;
  constructor(props){
    super(props);
    this.state = { 
      url: [],
      item: []
    }
  }

  componentDidMount = () =>{
    this._isMounted = true;
    let currentComponent = this;
    let classid = this.props.match.params.classid;
    axios.get('https://seniorbackend1.herokuapp.com/student',{headers: {'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'GET'}})
      .then(function(res){
        res.data.forEach(doc=>{
          if(classid === doc.classid){
            currentComponent.setState({
              url: [ ...currentComponent.state.url , doc ],
              item: [ ...currentComponent.state.url , doc ]
            })
          }
        }) 
      })
  }

  componentWillUnmount = () => {
      this._isMounted = false;
  }

  filterList = (e) => {
    let items = this.state.url;
    this.setState({word: e.target.value});
    items = items.filter((item) => {
      return (item.stdId.toLowerCase().search(e.target.value.toLowerCase()) !== -1 || item.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1);
    });
    this.setState({item: items});
  }

  render() {
    return (
      <div className="container">
        <br/>
        <div className="row justify-content-center align-items-center">
        <Form.Group md="4">
        <InputGroup>
            <InputGroup.Prepend>
                <InputGroup.Text>
                  <i class="fas fa-search"></i>
                </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
                type="text"
                placeholder="Search here..."
                onChange={this.filterList}
            />
        </InputGroup>
        </Form.Group>
        </div>
        <br/>
        <div className="row">
        {this.state.item.sort((a,b) =>a.stdId - b.stdId).map((u , index)=> 
        <Card style={{ width: '16rem' }}>
        <Card.Img variant="top" src={u.imageURL} />
        <Card.Body>
          <Card.Title>{u.name}</Card.Title>
          <Card.Text>
            {u.stdId}
          </Card.Text>
          <Link to={'/edit/'+ u.id}><Button variant="outline-info">Edit Profile</Button></Link>
        </Card.Body>
      </Card>
        )}
        </div>
      </div>
       
    );
  }
}
export default Home;