import React,{Component} from 'react';
import auth from '../firebase/firebase';
import { Route, BrowserRouter as Router, Link,Switch,useParams,
    useRouteMatch } from 'react-router-dom';
import '../css/login.css';
import Class from './Class';
import Header from '../components/Header';


class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : ''
        }
    }

    componentDidMount(){
        auth.onAuthStateChanged(user => {
            if (user) {
              this.setState({
                currentUser: user
              })
            }
        })
    }

    logOut = e => {
        e.preventDefault()
        auth.signOut().then(response => {
          this.setState({
            currentUser: null
          })
        })
      }

    onUsernameChange = (e) =>{
        this.setState({
            email : e.target.value
        })
    }

    onPasswordChange = (e) =>{
        this.setState({
            password : e.target.value
        })
    }

    onSubmit = (e) =>{
        e.preventDefault();
        auth
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(response => {
            this.setState({
            currentUser: response.user
            })
        })
        .catch(error => {
            this.setState({
            message: error.message
            })
        })
            this.setState({
                email : '',
                password: ''
            })
    }

    render(){
        const { message, currentUser } = this.state
        if (currentUser) {
            return (
              <div>
                <div className="navbar navbar-expand-sm bg-dark navbar-dark">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link to="/home"><div className="nav-link">Home</div></Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/image"><div className="nav-link">Photo Input</div></Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/camera"><div className="nav-link">Video Camera</div></Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/addstudent"><div className="nav-link">Add Student</div></Link>
                    </li>
                    <li class="nav-item">
                      <div className="nav-link">Hello {currentUser.email}</div>
                    </li>
                  </ul>
                  <button className="btn btn-outline-secondary" onClick={this.logOut}>Logout</button>
                </div>
              </div>
            )
          }
        return(
            <div className="justify-content-center align-items-center fluid">
              <div className="row">
                <div class="col-md-12 min-vh-100 d-flex flex-column justify-content-center">
                  <div className="row">
                    <div class="col-lg-6 col-md-8 mx-auto">
                      <div class="card rounded shadow shadow-sm">
                        <div class="card-header">
                          <h3 class="mb-0">Login</h3>
                        </div>
                        <div class="card-body">
                          <form onSubmit={this.onSubmit}>
                            {message ? <p className="text-danger">{message}</p> : null}
                            <div className="form-group">
                              <label for="Email">Email :</label>
                              <input type="text" 
                                    id="login" 
                                    className="form-control" 
                                    name="login" 
                                    placeholder="Email Address"
                                    onChange= {this.onUsernameChange}/>
                            </div>
                            <div className="form-group">
                            <label for="Password">Password :</label>
                            <input type="password" 
                                  id="password" 
                                  class="form-control" 
                                  name="login" 
                                  placeholder="Password"
                                  onChange= {this.onPasswordChange} />
                            </div>
                            <div>
                            <label class="custom-control custom-checkbox">
                              <input type="checkbox" class="custom-control-input"/>
                              <span class="custom-control-indicator"></span>
                              <span class="custom-control-description small text-dark">Forgot Password?</span>
                            </label>
                          </div>
                          <input type="submit" class="btn btn-primary float-right" value="Log In"/>
                        </form>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div className="form-group">
                        <div className="text-center">
                            <label>New around here ? <Link to="/signup">Sign Up</Link></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>   
        )
    }
}
export default Login;