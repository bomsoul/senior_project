import React, { Component } from 'react';
import { loadModels, getFullFaceDescription, createMatcher } from '../api/face';
import axios from 'axios';
import { Modal, Button, Table, Tabs, Tab } from 'react-bootstrap';

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
      name: [],
      open: false,
      present: [],
      absent: []
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.addItem = this.addItem.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  async componentDidMount(){
    axios.get('https://seniorbackend1.herokuapp.com/fetch/'+this.props.match.params.classid,{
      headers: {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods':'GET'}})
    .then(response =>{
      JSON_PROFILE = response.data;
    }).catch(function(error){
      console.log(error)
    })
    axios.get('https://seniorbackend1.herokuapp.com/student',
    {headers: {'Access-Control-Allow-Origin': '*'}})
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
    await loadModels();
    let profile = await axios.get("https://seniorbackend1.herokuapp.com/fetch/"+this.props.match.params.classid,
                              {headers: {'Access-Control-Allow-Origin': '*',
                              'Access-Control-Allow-Methods':'GET'}})
    JSON_PROFILE = profile.data
    this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
    // await this.handleImage(this.state.imageURL);
  };

  async handleImage (image){
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
      this.state.match.forEach(match =>{
        this.addItem(match._label);
      })
    }
  };


  async handleFileChange(event){
    this.resetState();
    await this.setState({
      imageURL: URL.createObjectURL(event.target.files[0]),
      loading: true
    });
    this.handleImage(this.state.imageURL);
  };

  resetState(){
    this.setState({ ...INIT_STATE });
  };

  handleShow(){
    this.setState({ open: true });
  }


  addItem(item) {
    var x = this.state.allstudent.findIndex(obj => obj.name ===item)
    if(this.state.present.findIndex(obj => obj.name ===item) < 0){
      this.setState({
        present: [...this.state.present,this.state.allstudent[x]]
      })
      let absentstudent =[]
      this.state.allstudent.forEach(student =>{
        if(this.state.present.findIndex(obj => obj.name ===student.name) < 0){
            absentstudent.push(student)
        }
      })
      this.setState({
        absent: absentstudent
      })
    }
  }

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
          <div className="text-center">
            <input
                  id="myFileUpload"
                  type="file"
                  onChange={this.handleFileChange} />
          </div>
        </div>
        <div style={{ position: 'absolute' }}>
          <div style={{ position: 'absolute' }}>
            <img src={imageURL} alt="imageURL"/>
            <div className="fluid-container">
            <Tabs defaultActiveKey="Present" transition={false} id="noanim-tab-example">
              <Tab eventKey="Present" title="Present">
                {
                  this.state.present.length !== 0? this.state.present.sort((a,b) =>a.stdId - b.stdId).map((key,index)=>
                  key._label === 'unknown' ?  <b></b>: 
                  <div>
                    <Item student={key}/>
                  </div>
                ) :<p>No one in class.</p>

                }
              </Tab>
              <Tab eventKey="Absent" title="Absent">
                {
                  this.state.absent !== null ? this.state.absent.sort((a,b) =>a.stdId - b.stdId).map((key,index)=>
                  key._label === 'unknown' ?  <b></b>: 
                    <Item student={key}/>
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
          {!!drawBox ? drawBox : null}
        </div>
        <div>
        </div>

      </div>
    );
  }
}

export default ImageInput;

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
  <div className="container-fluid">
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