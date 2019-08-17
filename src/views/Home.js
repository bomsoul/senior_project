import React, { Component } from 'react';
import firebase from '../firebase';

const db = firebase.firestore();

export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = { 
      url: []
    }
  }

  componentDidMount(){
    console.log(db);
    db.collection('student').get().then((snapshot)=>{
        snapshot.forEach(doc=>{
            // this.state.url = doc.data().urls;
            console.log(doc.data());
            this.setState({
                url: [ ...this.state.url , doc.data() ]
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
            </div>
        </div>
        )}
        </div>
      </div>
       
    );
  }
}
