import React, { Component } from 'react'
import HamburgerMenu from 'react-hamburger-menu'
import BookList from './book/BookList'


import {withRouter} from 'react-router-dom'

import './SideNav.css';

class SideNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen:false
        }

        this.handleClick = this.handleClick.bind(this);
        this.toggleSideNav = this.toggleSideNav.bind(this);
        this.addSong = this.addSong.bind(this);
    }

    handleClick() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    toggleSideNav() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    addSong() {
        this.toggleSideNav();
        this.props.history.push('/add/song');
    }

    toPrinter() {
        this.toggleSideNav();
        this.props.history.push('/printer');
    }

    render() {
        return (
            <div className="sideNav">
                <div className="toggle-box" onClick={this.handleClick}>
                <HamburgerMenu
                    isOpen={this.state.isOpen}
                    menuClicked={this.handleClick}
                    width={22}
                    height={20}
                    strokeWidth={1}
                    rotate={0}
                    color='black'
                    borderRadius={0}
                    animationDuration={0.5}
                    className="toggle"
                />
                </div>
                <div className={this.state.isOpen ? "nav-menu" : "nav-menu hidden"}>
                    { this.props.userLoggedIn ? 
                    <div className="nav-item login-nav" onClick={ ()=> this.props.handleLogout()}>Logout</div>
                    :
                    <div className="nav-item login-nav" onClick={ ()=> this.props.toggleLogin()}>Login</div>
                    }
                    { this.props.userLoggedIn ? <>
                    <div className="nav-item" onClick={ ()=> this.addSong()}>New Song</div>
                    <div className="nav-item" onClick={this.props.newBook}>New Book</div>
                    </>
                    : <></>}
                    <div className="nav-item">Books</div>
                    
                    < BookList toggleSideNav={this.toggleSideNav}/>
                    <div className="nav-item" onClick={ ()=> this.toPrinter()}>Printer</div>
                </div>
            </div>
            
        )
    }
}

export default withRouter(SideNav)