import React,{Component} from 'react';
import auth from '../firebase/firebase';

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : ''
        }
    }

    onEmailChange = (e) =>{
        this.setState({
            email: e.target.value
        })
        console.log(this.state.email)
    }

    onPasswordChange = (e) =>{
        this.setState({
            password: e.target.value
        })
    }

    onSubmit = e =>{
        e.preventDefault();
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(function(res){
            alert('Register Complete!');
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });

    }

    render(){
        return(
            <div className='container'>
                <form method="POST" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label for="email">Email address:</label>
                        <input  type="email" 
                                className="form-control" 
                                placeholder="Enter email" 
                                id="email"
                                onChange={this.onEmailChange}        
                        />
                    </div>
                    <div class="form-group">
                        <label for="pwd">Password:</label>
                        <input  type="password" 
                                className="form-control" 
                                placeholder="Enter password" 
                                id="pwd"
                                onChange={this.onPasswordChange}     
                    />
                    </div>
                    <input type="submit" value="register"/>
                </form>
            </div>
        )
    }
}
export default SignUp;