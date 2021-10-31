import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'font-awesome/css/font-awesome.min.css';

import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import {BookPrinterPage} from './components/printer/BookPrinterPage'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>

    <Route path="/printer/print/:id" exact component={BookPrinterPage} />
    <Route path="/"  component={App} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
