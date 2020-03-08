import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription, createMatcher } from '../api/face';
import axios from 'axios';

// Import face profile
let JSON_PROFILE = require('../descriptors/profile.json');

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

class CameraFaceDetect extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      fullDesc: null,
      detections: null,
      descriptors: null,
      faceMatcher: null,
      match: null,
      facingMode: null,
      matchList: [],
      allstudent: [],
      name: []
    };
  }

  componentDidMount = async () =>{
    axios.get('https://seniorbackend1.herokuapp.com/fetch/'+ this.props.match.params.classid,{headers: {'Access-Control-Allow-Origin': '*'}})
    .then(response =>{
      JSON_PROFILE = response.data;
    }).catch(function(error){
      console.log(error)
    })
    axios.get('https://seniorbackend1.herokuapp.com/student',{headers: {'Access-Control-Allow-Origin': '*'
                                                              ,'Access-Control-Allow-Methods':'GET'}})
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
    let profile = await axios.get('https://seniorbackend1.herokuapp.com/fetch/'+ this.props.match.params.classid,
                              {headers: {'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods':'GET'}})
    JSON_PROFILE = profile.data
    await loadModels();
    this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
    this.setInputDevice();
  };

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === 'videoinput'
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: 'user'
        });
      } else {
        await this.setState({
          facingMode: { exact: 'environment' }
        });
      }
      this.startCapture();
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
    if (!!this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then(fullDesc => {
        if (!!fullDesc) {
          this.setState({
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
    }
  };


  onDetect = (index) =>{
    if(index !== 'unknown'){
      if(this.state.matchList.indexOf(index) <= -1){
        this.setState({
          matchList: [...this.state.matchList,index]
        })
      }
    }
  }

  render() {
    const { detections, match, facingMode } = this.state;
    let videoConstraints = null;
    let camera = '';
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode
      };
      if (facingMode === 'user') {
        camera = 'Front';
      } else {
        camera = 'Back';
      }
    }

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
                  onChange= {this.onDetect(match[i]._label)}
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
      <div
        className="Camera"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p>Camera: {camera}</p>
        <div
          style={{
            width: WIDTH,
            height: HEIGHT
          }}
        >
          <div style={{ position: 'relative', width: WIDTH }}>
            {!!videoConstraints ? (
              <div style={{ position: 'absolute' }}>
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={this.webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
            ) : null}
            {!!drawBox ? drawBox : null}
          </div>
        </div>
            {Array.from(this.state.matchList).map((match, index) =><div className="container-fluid">
              <div className="row">
                  <div className="col-12 mt-3">
                      <div className="card">
                          <div className="card-horizontal">
                              <div className="img-square-wrapper">
                                  <img className="" src={this.state.allstudent[this.state.name.indexOf(match)].imageURL} width="120" height="120" alt="Card image cap"/>
                              </div>
                              <div className="card-body">
                                  <h4 className="card-title">{match}</h4>
                                  <p className="card-text">{this.state.allstudent[this.state.name.indexOf(match)].stdId}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>)}
      </div>
      
    );
  }
}

export default CameraFaceDetect;