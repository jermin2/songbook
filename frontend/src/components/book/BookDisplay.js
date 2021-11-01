import React, { Component } from 'react'

import BookService from './BookService'

import {SongsList} from '../song/SongsList'
import SongDisplay from '../song/SongDisplay'

import { Link } from 'react-router-dom'


const bookService = new BookService()

class BookDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: {
                book_id: -1,
                name: "",
                songs: [],
            },
            widescreen: true,
            selectedSong: -1
        }

        this.setId = this.setId.bind(this);
    }

    componentDidMount() {
        const { match: {params} } = this.props;
        if(params && params.id) {
            //Fetch the new book
            var self = this;
            bookService.getBook(params.id).then(function(result) {
                self.setState({
                    book: result
                })
            })
        }
    }


    componentDidUpdate(preProps, prevState) {
        
        //Check we have a valid book input
        const { match: {params} } = this.props;
        if(params && params.id) {

            //Check it is a different book than what we already have
            if (parseInt(params.id) !== this.state.book.book_id) {
                var self = this;

                //Fetch the new book
                bookService.getBook(params.id).then(function(result) {
                    self.setState({
                        book: result,
                        selectedSong: -1
                    })
                })
            }
        }
    }

    // Callback function used by songlist to indicate a selection of a song
    setId(id){
        console.log("book display",id);
        this.setState({
            selectedSong: id
        })
    }

    delete(id){
        var r = window.confirm("This will delete the book - this cannot be reversed");
        if (r){
            bookService.deleteBook(this.state.book.book_id);
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div className="book-display-parent widescreen-parent">
                <div className="book-display widescreen">
                    <h2 className="book-name">{this.state.book.name}</h2>
                    {this.props.userLoggedIn && 
                    <div className="links-parent">
                        <Link  className="book-control-link" to={`/book/${this.state.book.book_id}/edit`}>Edit</Link>
                        <button className="control-link" onClick={()=>this.delete(this.state.book.book_id)}>Delete</button>
                    </div>
                    }
                    < SongsList book={this.state.book} mode={'BOOK_LIST'} setId={this.setId}/>
                </div>
                { this.state.selectedSong > -1 &&
                    <div className="book-display-song widescreen">
                        < SongDisplay id={this.state.selectedSong} widescreen="true" userLoggedIn={this.props.userLoggedIn}/>
                    </div>
                }
            </div>
            
        )
    }
}

export default BookDisplay