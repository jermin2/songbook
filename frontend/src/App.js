import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Route } from 'react-router-dom';
import SongsList from './song/SongsList'
import SongDisplay from './song/SongDisplay'
import SongEdit from './song/SongEdit'
import BookDisplay from './book/BookDisplay'

import LoginModal from "react-login-modal";

import Modal from 'react-bootstrap/Modal';

import SideNav from './SideNav'
import './App.css';



class App extends Component {  

  constructor(props){
    super(props);
    this.state = {
      showLogin: false
    }

    this.toggleLogin = this.toggleLogin.bind(this);
  }

  toggleLogin() {
    this.setState({
      showLogin: !this.state.showLogin
    })
  }

  handleLogin(){
    console.log("handle login")
  }

  render() {
    return (
      <BrowserRouter>
      <div className="main">
        <SideNav toggleLogin={this.toggleLogin} />
        <div className="app">
          <h1 className="title"><Link to="/">Song Book</Link></h1>

          <div className="content">
            <Route path="/" exact component={SongsList} />
            <Route path="/song/:id" exact component={SongDisplay} />
            <Route path="/book/:id" component={BookDisplay} />
            <Route path="/song/:id/edit" component={SongEdit} />
          </div>
        </div>
      </div>
      <Modal show={this.state.showLogin}>
        <LoginModal
          handleSignup={this.handleSignup}
          handleLogin={this.handleLogin}
        />
      </Modal>
      </BrowserRouter>
    )
  }
}

export default App;