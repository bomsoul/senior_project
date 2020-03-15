import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription, createMatcher } from '../api/face';
import axios from 'axios';
import { Button, Modal, Table, Tabs, Tab  } from 'react-bootstrap';

// Import face profile
let JSON_PROFILE = require('../descriptors/profile.json');

const WIDTH = 700;
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

  componentWillUnmount() {
    clearInterval(this.interval);
  }

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
        <Tabs className="container-fluid" defaultActiveKey="Present" transition={false} id="noanim-tab-example">
              <Tab eventKey="Present" title="Present">
                {
                  this.state.present.length !== 0? this.state.present.sort((a,b) =>a.stdId - b.stdId).map((key,index)=>
                  key._label === 'unknown' ?  <b></b>: 
                  <div>
                    <Item student={key} className="container-fluid"/>
                  </div>
                ) :<p>No one in class.</p>

                }
              </Tab>
              <Tab eventKey="Absent" title="Absent">
                {
                  this.state.absent !== null ? this.state.absent.sort((a,b) =>a.stdId - b.stdId).map((key,index)=>
                  key._label === 'unknown' ?  <b></b>: 
                    <Item student={key} className="container-fluid"/>
                  ) :<p>Everone is in the class.</p> 
                }
              </Tab>
              <Tab eventKey="All Result" title="All Result">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Fullname</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.allstudent.sort((a,b) =>a.stdId - b.stdId).map((student, index)=>
                      <tr>
                        <td>{student.stdId}</td>
                        <td>{student.name}</td>
                        <td>{this.state.present.indexOf(student) >= 0 ? <div className="text-success"><i class="fas fa-check"></i></div>: <div className="text-danger"><i class="fas fa-times"></i></div>}</td>
                      </tr>
                    )                    
                  }
                  <tr>
                    <td><b>Total :</b></td>
                    <td></td>
                  <td>Present : {this.state.present.length}<br/>
                      Absent : {this.state.absent.length}</td>
                  </tr>
                  </tbody>
                  </Table>
              </Tab>
            </Tabs>
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

const Item = ({student}) =>(
  <div className="">
      <div className="row">
          <div className="col-12 mt-3">
              <div className="card">
                  <div className="card-horizontal">
                      <div className="img-square-wrapper">
                          <img src={student.imageURL} width="120" height="120" alt="Card image cap"/>
                      </div>
                      <div className="card-body">
                          <h4 className="card-title">{student.name}</h4>
                          <p className="card-text">{student.stdId}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
)