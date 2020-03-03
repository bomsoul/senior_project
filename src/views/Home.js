import React, { Component } from 'react';
import axios from 'axios';
import {Card,Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = { 
      url: []
    }
  }

  componentDidMount(){
    let currentComponent = this;
    axios.get('https://seniorbackend1.herokuapp.com/student',{headers: {'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'GET'}})
      .then(function(res){
        res.data.forEach(doc=>{
          currentComponent.setState({
            url: [ ...currentComponent.state.url , doc ]
          })
        }) 
      })
}
  render() {
    return (
      <div className="container">
        <div className="row">
        {this.state.url.map((u , index)=> 
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