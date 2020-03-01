import React, { Component } from 'react';

class Header extends Component {

  render() {
    return (
          <div className="navbar navbar-expand-sm bg-dark navbar-dark">
            <ul className="navbar-nav">
          <li className="nav-item">
            <div className="nav-link"><a href="/home">Home</a></div>
          </li>
          <li className="nav-item">
            <div className="nav-link"><a to="/photo">Photo Input</a></div>
          </li>
          <li className="nav-item">
            <div className="nav-link"><a to="/camera">Video Camera</a></div>
          </li>
          <li className="nav-item">
            <div className="nav-link"><a to="/addstudent">Add Student</a></div>
          </li>
          </ul>
          </div>
    );
  }
}

export default Header;
