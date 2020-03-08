import React,{Component} from 'react';
import auth from '../firebase/firebase';
import firebase from 'firebase';

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            name : '',
            email : '',
            password : '',
            errormessage : '',
        }
    }

    onEmailChange = (e) =>{
        this.setState({
            email: e.target.value
        })
    }

    onPasswordChange = (e) =>{
        this.setState({
            password: e.target.value
        })
    }

    onSubmit = e =>{
        e.preventDefault();
        firebase.firestore().collection('teacher').add({
            name : this.state.name,
            email: this.state.email,
            password: this.state.password 
        })
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(function(res){
            alert('Register Complete!');
            window.location.href = "/";
        })
        .catch(function(error) {
            // Handle Errors here.
            this.setState({
                errormessage: error.message
            })
            // ...
        });
    }

    render(){
        return(
            <div className='container'>
                <h2>Create Your Account Here</h2>
                <div class="dropdown-divider"></div>
                <p className="text-danger">{this.state.errormessage? this.state.errormessage: ''}</p>
                <form method="POST" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label for="email">Email address:</label>
                        <input  type="email" 
                                className="form-control" 
                                placeholder="example@mail.com" 
                                id="email"
                                onChange={this.onEmailChange} 
                                required       
                        />
                    </div>
                    <div class="form-group">
                        <label for="pwd">Password:</label>
                        <input  type="password" 
                                className="form-control" 
                                placeholder="Enter password" 
                                id="pwd"
                                onChange={this.onPasswordChange}
                                required   
                    />
                    </div>
                    <input type="submit" className="btn btn-success" value="Register Account"/>
                </form>
            </div>
        )
    }
}
export default SignUp;