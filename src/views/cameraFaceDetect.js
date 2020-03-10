import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription, createMatcher } from '../api/face';
import axios from 'axios';
import { Button, Modal, Table } from 'react-bootstrap';

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
      name: [],
      open: false,
      present: [],
      absent: []
    };
    this.setInputDevice = this.setInputDevice.bind(this);
    this.startCapture = this.startCapture.bind(this);
    this.capture = this.capture.bind(this);
    this.onDetect = this.onDetect.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  async componentDidMount(){
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
        if(doc.classid === this.props.match.params.classid){
          this.setState({ 
            allstudent: [...this.state.allstudent,doc],
            name: [...this.state.name,doc.name],
            absent: [...this.state.allstudent,doc]
          })
        }
      })
    }).catch(function(error){
      console.log(error)
    })
  }

  async componentWillMount(){
    let profile = await axios.get('https://seniorbackend1.herokuapp.com/fetch/'+ this.props.match.params.classid,
                              {headers: {'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods':'GET'}})
    JSON_PROFILE = profile.data
    await loadModels();
    this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
    this.setInputDevice();
  };

  setInputDevice(){
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

  startCapture(){
    this.interval = setInterval(() => {
      this.capture();
    }, 1500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async capture(){
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


  onDetect(index){
    if(index !== 'unknown'){
      if(this.state.matchList.indexOf(index) <= -1){
        this.setState({
          matchList: [...this.state.matchList,index]
        })
        this.addItem(index);
      }
    }
  }

  handleShow(){
    this.setState({ open: true });
  }


  addItem(item) {
    var x = this.state.allstudent.findIndex(obj => obj.name ===item)
    if(this.state.present.findIndex(obj => obj.name ===item) < 0){
      this.setState({
        present: [...this.state.present,this.state.allstudent[x]]
      })
      // let absentstudent =[]
      // let present = this.state.present;
      // this.state.allstudent.forEach(student =>{
      //   if(present.findIndex(obj => obj.name ===student.name) < 0){
      //       absentstudent.push(student)
      //   }
      // })
      // this.setState({
      //   absent: absentstudent
      // })
      this.setState({absent: this.state.absent.filter(function(student) { 
        return student.name !== item 
      })});
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
      <div>
          <div className="text-right">
            <Button variant="outline-secondary" onClick={this.handleShow}>
              See Absent Student
            </Button>
          </div>
          <div className="fluid-container">
            <ModalComponent fluid open={this.state.open} hide={() => this.setState({open: false})} absent={this.state.absent} />
          </div>
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
            {Array.from(this.state.matchList).map((match, index) =>
              <Item allstudent={this.state.allstudent} name={this.state.name} label={match}/>
              )}
      </div>
      </div>
    );
  }
}

export default CameraFaceDetect;

const ModalComponent = ({open, hide , absent}) => (
  <Modal show={open} onHide={hide}>
    <Modal.Header closeButton>
      <Modal.Title>Absent Student</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Fullname</th>
          </tr>
        </thead>
        <tbody>
            {
              absent.sort((a,b) =>a.stdId - b.stdId)
              .map((student,index)=>
                <tr>
                  <td>{student.stdId}</td>
                  <td>{student.name}</td>
                </tr>
              )
            }
        </tbody>
      </Table>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="danger" onClick={hide}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
)

const Item = props => (
  <div className="container-fluid">
    <div className="row">
          <div className="col-12 mt-3">
              <div className="card">
                  <div className="card-horizontal">
                      <div className="img-square-wrapper">
                          <img src={props.allstudent[props.name.indexOf(props.label)].imageURL} width="120" height="120" alt="Card image cap"/>
                      </div>
                      <div className="card-body">
                          <h4 className="card-title">{props.label}</h4>
                          <p className="card-text">{props.allstudent[props.name.indexOf(props.label)].stdId}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
)