import React, { Component } from 'react';
import firebase from '../firebase';
import axios from 'axios';

const db=firebase.firestore();

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = { 
      url: []
    }
  }

  componentDidMount(){
    let currentComponent = this;
    axios.get('http://localhost:4000/student',{headers: {'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'GET'}})
      .then(function(res){
        res.data.forEach(doc=>{
          console.log(doc);
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
        //<img key={index} src={u.urls} alt="hello my image" />
        <div className="card" style={{width: '300px'}}>
            <img className="card-img-top" key={index} src={u.imageURL} alt="Card image"/>
            <div className="card-body" >
                <h4 className="card-title">{u.name}</h4>
                <h4 className="card-title">{u.stdId}</h4>
            </div>
        </div>
        )}
        </div>
      </div>
       
    );
  }
}
