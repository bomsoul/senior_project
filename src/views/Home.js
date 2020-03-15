import React, { Component } from 'react';
import axios from 'axios';
import {Card, Button, InputGroup, Form} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = { 
      url: [],
      item: []
    }
    this.filterList = this.filterList.bind(this);
  }

  componentDidMount(){
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


  filterList(e){
    let items = this.state.url;
    this.setState({word: e.target.value});
    items = items.filter((item) => {
      return (item.stdId.toLowerCase().search(e.target.value.toLowerCase()) !== -1 || item.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1);
    });
    this.setState({item: items});
  }

  listStudent(){
    return this.state.item.sort((a,b) =>a.stdId - b.stdId).map(function(student,i){
      return <CardComponent student={student}/>
    })
  }

  render() {
    return (
      <div className="container">
        <br/>
        <div className="row justify-content-center align-items-center">
          <Search onClick={this.filterList}/>
        </div>
        <br/>
        <div className="row">
        {
          this.listStudent()
        }
        </div>
      </div>
       
    );
  }
}
export default Home;

const CardComponent = ({student}) => (
  <Card style={{ width: '16rem' }}>
    <Card.Img variant="top" src={student.imageURL} />
    <Card.Body>
      <Card.Title>{student.name}</Card.Title>
      <Card.Text>
        {student.stdId}
      </Card.Text>
      <Link to={'/edit/'+ student.id}><Button variant="outline-info">Edit Profile</Button></Link>
    </Card.Body>
  </Card>
)

const Search = ({onClick}) =>(
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
            onChange={onClick}
        />
    </InputGroup>
  </Form.Group>
)