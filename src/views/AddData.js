import React, { Component } from 'react';
import { loadModels, getFullFaceDescription } from '../api/face';
import { storage } from '../firebase/firebase';
import firebase from 'firebase';

// Initial State
const INIT_STATE = {
  imageURL: 'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg',
  fullDesc: null,
  detections: null,
  descriptors: null,
  match: null
};

const db=firebase.firestore();
class AddData extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INIT_STATE,
            image: null,
            name : "",
            stdId: "",
            urllink: "",
          
        };
      }
    
      componentWillMount = async () => {
        await loadModels();
        await this.handleImage(this.state.imageURL);
      };
    
      handleImage = async (image = this.state.imageURL) => {
        await getFullFaceDescription(image).then(fullDesc => {
          if (!!fullDesc) {
            this.setState({
              fullDesc : fullDesc[0].descriptor,
              detections: fullDesc.map(fd => fd.detection)
            });
          }
        });
      };
    
      handleFileChange = async event => {
        this.resetState();
        if(event.target.files[0]){
            const image = event.target.files[0];
            this.setState( () =>({image}));
        }
        await this.setState({
          imageURL: URL.createObjectURL(event.target.files[0]),
          loading: true
        });
        this.handleImage();
      };
    
      handleNameChange = (e)=>{
        this.setState({
          name : e.target.value
        })
      }

      handleStdIdChange = (e) =>{
        this.setState({
          stdId : e.target.value
        })
      }
    
      handleUpload = () =>{
        const {image} = this.state;
        const uploadTask = storage.ref('profile/'+image.name).put(image);
        uploadTask.on('state_changed',
        (snapshot) =>{

        },
        (error) => {
            console.log(error);
        },
        () => {
            storage.ref('profile').child(image.name).getDownloadURL().then(url =>{
              var urlx = url.toString();
                this.setState({ 
                  urllink : urlx
                })
                var data ={
                    imageURL: this.state.urllink,
                    name: this.state.name,
                    stdId: this.state.stdId,
                    descriptors: Array.from(this.state.fullDesc)
                }
                db.collection("student").doc().set(data).then(function() {
                  console.log("Document successfully written!");
                  alert("Add data Successful")
              });
            })
        });
    }
      resetState = () => {
        this.setState({ ...INIT_STATE });
      };
    
      render() {
        const { imageURL, detections } = this.state;
    
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
                />
              </div>
            );
          });
        }
    
        return (
            <div className="container">
            <div className="text-center">
            <input
                    id="myFileUpload"
                    type="file"
                    onChange={this.handleFileChange}
                    accept=".jpg, .jpeg, .png"/>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute' }}>
                <img src={imageURL} alt="imageURL" />{
                    this.state.fullDesc == null ? <p></p> :<div>
                    <br/>
                        <div className="form-inline">
                            <label><b>Name :</b></label>
                            <input type="text" 
                                placeholder="Enter your fullname"
                                name = "fullname"
                                className ="form-control"
                                onChange = {this.handleNameChange}
                                value={this.state.name}
                            />
                        </div>
                        <div className="form-inline">
                            <label><b>Student ID :</b></label>
                            <input type="text" 
                                placeholder="Enter your studentID"
                                name = "stdID"
                                className ="form-control"
                                onChange={this.handleStdIdChange}
                                value={this.state.stdId }
                            />
                        </div>
                        <button className="btn btn-success" onClick={this.handleUpload}>Add to Database</button>
                </div>
                    
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
export default AddData;