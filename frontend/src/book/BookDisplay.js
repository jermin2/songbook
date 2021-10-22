import React, { Component } from 'react'

import BookService from './BookService'

import SongsList from '../song/SongsList'

const bookService = new BookService()

class BookDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: {
                id: -1,
                title: "",
                songs: []
            }
        }
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
            if (parseInt(params.id) !== this.state.book.id) {
                var self = this;

                //Fetch the new book
                bookService.getBook(params.id).then(function(result) {
                    self.setState({
                        book: result
                    })
                })
            }
        }
        
    }

    render() {
        return (
            <div>
                <h2 className="book-name">{this.state.book.title}</h2>
                < SongsList book={this.state.book} mode="book"/>

            </div>
            
        )
    }
}

export default BookDisplay