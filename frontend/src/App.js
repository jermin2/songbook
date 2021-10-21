import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import SongsList from './song/SongsList'
import SongDisplay from './song/SongDisplay'

import SideNav from './SideNav'
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div className="main">
        <SideNav />
        <div className="app">
          <h1 class="title">Song Book</h1>

          <div className="content">
            <Route path="/" exact component={SongsList} />
            <Route path="/song/:id" component={SongDisplay} />
          </div>
        </div>
      </div>
      </BrowserRouter>
    )
  }
}

export default App;