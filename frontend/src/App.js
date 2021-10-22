import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Route } from 'react-router-dom';
import SongsList from './song/SongsList'
import SongDisplay from './song/SongDisplay'
import BookDisplay from './book/BookDisplay'

import SideNav from './SideNav'
import './App.css';



class App extends Component {  

  render() {
    return (
      <BrowserRouter>
      <div className="main">
        <SideNav />
        <div className="app">
          <h1 className="title"><Link to="/">Song Book</Link></h1>

          <div className="content">
            <Route path="/" exact component={SongsList} />
            <Route path="/song/:id" component={SongDisplay} />
            <Route path="/book/:id" component={BookDisplay} />
          </div>
        </div>
      </div>
      </BrowserRouter>
    )
  }
}

export default App;