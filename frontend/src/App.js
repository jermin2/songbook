import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Link } from 'react-router-dom';
import SongsList from './song/SongsList'
import SongDisplay from './song/SongDisplay'

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <h1>Song Book</h1>

        <div className="content">
          <Route path="/" exact component={SongsList} />
          <Route path="/song/:id" component={SongDisplay} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App;