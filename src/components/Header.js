import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {

  render() {
    return (
          <div className="navbar navbar-expand-sm bg-dark navbar-dark">
            <ul className="navbar-nav">
          <li className="nav-item">
            <div className="nav-link"><Link to="/home">Home</Link></div>
          </li>
          <li className="nav-item">
            <div className="nav-link"><Link to="/photo">Photo Input</Link></div>
          </li>
          <li className="nav-item">
            <div className="nav-link"><Link to="/camera">Video Camera</Link></div>
          </li>
          <li className="nav-item">
            <div className="nav-link"><Link to="/addstudent">Add Student</Link></div>
          </li>
          </ul>
          </div>
    );
  }
}

export default Header;
