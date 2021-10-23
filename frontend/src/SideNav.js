import React, { Component } from 'react'
import HamburgerMenu from 'react-hamburger-menu'
import BookList from './book/BookList'

import './SideNav.css';

class SideNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen:false
        }

        this.handleClick = this.handleClick.bind(this);
        this.toggleSideNav = this.toggleSideNav.bind(this);
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
                    <div className="nav-item" onClick={ ()=> this.props.toggleLogin()}>Login</div>
                    
                    <div className="nav-item">Books</div>
                    < BookList toggleSideNav={this.toggleSideNav}/>
                </div>
            </div>
            
        )
    }
}

export default SideNav