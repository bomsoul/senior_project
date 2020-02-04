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
            <div className="nav-link"><Link to="/home">Home</Link></div>
          </li>
          <li className="nav-item">
            <div className="nav-link"><Link to="/image">Photo Input</Link></div>
          </li>
          <li className="nav-item">
            <div className="nav-link"><Link to="/camera">Video Camera</Link></div>
          </li>
          <li className="nav-item">
            <div className="nav-link"><Link to="/addstudent">Add Student</Link></div>
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
            <div class="wrapper fadeInDown">
                <div id="formContent">
                    <div class="fadeIn first">
                        <div id="icon">
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                    <form onSubmit={this.onSubmit}>
                        <input type="text" 
                                id="login" 
                                class="fadeIn second" 
                                name="login" 
                                placeholder="Username or Email"
                                onChange= {this.onUsernameChange}
                        />
                        <input type="password" 
                               id="password" 
                               class="fadeIn third" 
                               name="login" 
                               placeholder="Password"
                               onChange= {this.onPasswordChange}
                        />
                        <input type="submit" class="fadeIn fourth" value="Log In"/>
                        <button><Link to="/signup" className="btn btn-success">Register Account!!</Link></button>
                    </form>
                    <div id="formFooter">
                        <a className="underlineHover" href="#">Forgot Password?</a>
                    </div>
                    {message ? <p className="help is-danger">{message}</p> : null}
                </div>
            </div>
            
        )
    }
}
export default Login;