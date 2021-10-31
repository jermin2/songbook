import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Route } from 'react-router-dom';
import {SongsList} from './components/song/SongsList'
import SongDisplay from './components/song/SongDisplay'
import SongEdit from './components/song/SongEdit'
import BookDisplay from './components/book/BookDisplay'
import {BookEdit} from './components/book/BookEdit'
import {BookPrinter} from './components/printer/BookPrinter'
import {PrinterList} from './components/printer/PrinterList'
import {BookPrinterPage} from './components/printer/BookPrinterPage'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import LoginModal from "react-login-modal";

import Modal from 'react-bootstrap/Modal';

import NewBookModal from './components/NewBookModal'
import SideNav from './components/SideNav'
import './App.css';

import AuthService from './AuthService'
const authService = new AuthService();

class App extends Component {  
  
  constructor(props){
    super(props);
    this.state = {
      showLogin: false,
      userLoggedIn: false,
      showNewBook: false,
    }

    this.toggleLogin = this.toggleLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleShowNewBook = this.toggleShowNewBook.bind(this);
    
  }

  toggleShowNewBook() {
    this.setState({
      showNewBook: !this.state.showNewBook
    })
  }

  toggleLogin() {
    this.setState({
      showLogin: !this.state.showLogin
    })
  }

  handleLogin(username, password){
    if( authService.login(username, password) ){
      alert("User Logged In");
      this.setState({
        showLogin: false,
        userLoggedIn: true
      })

    }

  }
  handleLogout(){
    authService.logout();
    this.setState({
      userLoggedIn: false,
      showLogin: false,
    })
    alert('User Logged Out');

  }
  render() {

    return (
      <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
      <div className="main" onScroll={()=>{console.log("scroll")}}>
      
        <SideNav 
          toggleLogin={this.toggleLogin} 
          handleLogout={this.handleLogout} 
          userLoggedIn={this.state.userLoggedIn} 
          newBook={this.toggleShowNewBook}/>
        <div className="app" >
          <h1 className="title"><Link to="/">Song Book</Link></h1>

          <div className="content">
            <Route path="/" exact render={(props) => <SongsList {...props} mode={'SONG_LIST'} />} />
            <Route path="/song/:id/edit" component={SongEdit} />
            <Route path="/book/:id/edit"  component={BookEdit} />
            <Route path="/add/song" exact component={SongEdit} />
            <Route path="/printer/:id" exact component={BookPrinter} />
            <Route path="/printer/" exact render={(props) => <PrinterList {...props} userLoggedIn={this.state.userLoggedIn} />} />
            <Route path="/print/:id" exact component={BookPrinterPage} />
            <Route path="/song/:id" exact render={(props) => <SongDisplay {...props} userLoggedIn={this.state.userLoggedIn} />} />
            {/* <Route path="/book/:id" exact component={BookDisplay} /> */}
            <Route exact path="/book/:id" render={(props) => <BookDisplay {...props} userLoggedIn={this.state.userLoggedIn} />} />

          </div>
        </div>
      </div>

      <div>
      <button onClick={this.login}>Click me</button>
      <button onClick={this.checkLogin}>Then click me</button>
      <button onClick={this.logout}>Logout</button>
      </div>

      <Modal show={this.state.showLogin}>
        <LoginModal
          handleSignup={this.handleSignup}
          handleLogin={this.handleLogin}
        />
        <button onClick={this.toggleLogin}>Close</button>
      </Modal>
      <NewBookModal show={this.state.showNewBook} toggleShow={this.toggleShowNewBook}/>
      </BrowserRouter>
      </DndProvider>
    )
  }
}

export default App;