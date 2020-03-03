import React, { Component } from 'react';
import auth from '../firebase/firebase';
import {Link} from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";


class Header extends Component {
  constructor(props){
    super(props);
    
  }
  logOut = e => {
    e.preventDefault()
    auth.signOut().then(response => {
      this.setState({
        currentUser: null
      })
    })
    window.location.href = "/";
  }
  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <div className="container">
        <Navbar.Brand><div className="font-size w3-spin"><i class="fab fa-react"></i></div></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer exact to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/photo">
              <Nav.Link>Photo Input</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/camera">
              <Nav.Link>Video Camera</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/addstudent">
              <Nav.Link>Add Student</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            <Nav.Link onClick={this.logOut}>Logout <i class="fas fa-sign-out-alt"></i></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
    );
  }
}

export default Header;
