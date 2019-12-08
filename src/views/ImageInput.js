import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { loadModels, getFullFaceDescription, createMatcher } from '../api/face';
import axios from 'axios';

// Import face profile
let JSON_PROFILE = require('../descriptors/bnk48.json');


// Initial State
const INIT_STATE = {
  imageURL: null,
  fullDesc: null,
  detections: null,
  descriptors: null,
  match: null
};

class ImageInput extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INIT_STATE, faceMatcher: null };
  }

  componentDidMount = async () =>{
    axios.get('http://localhost:4000/fetch',{headers: {'Access-Control-Allow-Origin': '*'}})
    .then(response =>{
      JSON_PROFILE = response.data;
    }).catch(function(error){
      console.log(error)
    })
  }


  componentWillMount = async () => {
    let profile = await axios.get('http://localhost:4000/fetch',
                              {headers: {'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods':'GET'}})
    JSON_PROFILE = profile.data
    console.log(JSON_PROFILE)
    await loadModels();
    this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
    await this.handleImage(this.state.imageURL);
  };

  handleImage = async (image = this.state.imageURL) => {
    await getFullFaceDescription(image).then(fullDesc => {
      if (!!fullDesc) {
        this.setState({
          fullDesc, 
          detections: fullDesc.map(fd => fd.detection),
          descriptors: fullDesc.map(fd => fd.descriptor)
        });
        for(var object in JSON_PROFILE){
          for(var obj in fullDesc){
            if(JSON_PROFILE[object].descriptors.toString() == fullDesc[obj].descriptor.toString()){
              console.log(JSON_PROFILE[object].name);
            }
          }
        }
      }
    });

    if (!!this.state.descriptors && !!this.state.faceMatcher) {
      let match = await this.state.descriptors.map(descriptor =>
        this.state.faceMatcher.findBestMatch(descriptor)
      );
      this.setState({ match });
      console.log(match)
    }
  };

  // getObject = () =>{
  //   for(var object in JSON_PROFILE){
  //     console.log(JSON_PROFILE[object].descriptors.toString());
  //   }
  // }

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
        <div>
          {
            this.state.match == null ? <p>No face detect</p>:<p>{this.state.match.length} face detect</p>
          }
        </div>
        <input
          id="myFileUpload"
          type="file"
          onChange={this.handleFileChange}
          accept=".jpg, .jpeg, .png"
        />
        <div style={{ position: 'absolute' }}>
          <div style={{ position: 'absolute' }}>
            <img src={imageURL} alt="imageURL"  />
            {
            // for(var face in this.state.match)
            //   <p>{this.state.match[face]._label}</p>
            this.state.match == null ? <h1></h1>:
            
            this.state.match.map((key,index)=>
              key._label == 'unknown' ?  <b></b>: 
              <div className="container-fluid">
              <div className="row">
                  <div className="col-12 mt-3">
                      <div className="card">
                          <div className="card-horizontal">
                              <div className="img-square-wrapper">
                                  <img className="" src={key.imageURL} width="300" height="180" alt="Card image cap"/>
                              </div>
                              <div className="card-body">
                                  <h4 className="card-title">{key._label}</h4>
                                  <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
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

export default withRouter(ImageInput);