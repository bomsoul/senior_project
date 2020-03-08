import React, { Component } from 'react';
import { loadModels, getFullFaceDescription, createMatcher } from '../api/face';
import axios from 'axios';

// Import face profile
let JSON_PROFILE = require('../descriptors/profile.json');


// Initial State
const INIT_STATE = {
  imageURL: 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg',
  fullDesc: null,
  detections: null,
  descriptors: null,
  match: null,
};

class ImageInput extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INIT_STATE, faceMatcher: null,
      allstudent: [],
      name: [] };
  }

  componentDidMount = async () =>{
    axios.get('https://seniorbackend1.herokuapp.com/fetch/'+this.props.match.params.classid,{
      headers: {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'GET'}})
    .then(response =>{
      JSON_PROFILE = response.data;
      console.log(JSON_PROFILE)
    }).catch(function(error){
      console.log(error)
    })
    axios.get('https://seniorbackend1.herokuapp.com/student',
    {headers: {'Access-Control-Allow-Origin': '*'}})
    .then(response =>{
      response.data.forEach(doc =>{
        this.setState({ 
          allstudent: [...this.state.allstudent,doc],
          name: [...this.state.name,doc.name]
        })
      })
    }).catch(function(error){
      console.log(error)
    })
  }


  componentWillMount = async () => {
    await loadModels();
    let profile = await axios.get("https://seniorbackend1.herokuapp.com/fetch/"+this.props.match.params.classid,
                              {headers: {'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods':'GET'}})
    JSON_PROFILE = profile.data
    this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
    // await this.handleImage(this.state.imageURL);
  };

  handleImage = async (image = this.state.imageURL) => {
    await getFullFaceDescription(image).then(fullDesc => {
      if (!!fullDesc) {
        this.setState({
          fullDesc, 
          detections: fullDesc.map(fd => fd.detection),
          descriptors: fullDesc.map(fd => fd.descriptor)
        });
      }
    });

    if (!!this.state.descriptors && !!this.state.faceMatcher) {
      let match = await this.state.descriptors.map(descriptor =>
        this.state.faceMatcher.findBestMatch(descriptor)
      );
      this.setState({ match });
    }
  };


  handleFileChange = async event => {
    this.resetState();
    await this.setState({
      imageURL: URL.createObjectURL(event.target.files[0]),
      loading: true
    });
    this.handleImage();
  };

  resetState = () => {
    this.setState({ ...INIT_STATE });
  };

  render() {
    const { imageURL, detections, match } = this.state;
    let drawBox = null;
    if (!!detections) {
      drawBox = detections.map((detection, i) => {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                border: 'solid',
                borderColor: 'blue',
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`
              }}
            >
              {!!match && !!match[i] ? (
                <p
                  style={{
                    backgroundColor: 'blue',
                    border: 'solid',
                    borderColor: 'blue',
                    width: _W,
                    marginTop: 0,
                    color: '#fff',
                    transform: `translate(-3px,${_H}px)`
                  }}
                >
                  {match[i]._label}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
    }

    return (
      
        <div>
        <div className="text-center">
          {
            this.state.match == null ? <p>No face detect</p>:<p>{this.state.match.length} face detect</p>
          }
          <input
                  id="myFileUpload"
                  type="file"
                  onChange={this.handleFileChange} />
        </div>
        <div style={{ position: 'absolute' }}>
          <div style={{ position: 'absolute' }}>
            <img src={imageURL} alt="imageURL"  />
            {
            this.state.match == null ? <h1></h1>:
            
            this.state.match.map((key,index)=>
              key._label === 'unknown' ?  <b></b>: 
              <div className="container-fluid">
              <div className="row">
                  <div className="col-12 mt-3">
                      <div className="card">
                          <div className="card-horizontal">
                              <div className="img-square-wrapper">
                                  <img className="" src={this.state.allstudent[this.state.name.indexOf(key._label)].imageURL} width="120" height="120" alt="Card image cap"/>
                              </div>
                              <div className="card-body">
                                  <h4 className="card-title">{key._label}</h4>
                                  <p className="card-text">{this.state.allstudent[this.state.name.indexOf(key._label)].stdId}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
            )
          }
          </div>
          {!!drawBox ? drawBox : null}
        </div>
        <div>
        </div>

      </div>
    );
  }
}

export default ImageInput;