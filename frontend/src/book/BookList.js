import React, { Component } from 'react';
import { Link } from "react-router-dom";

import BookService from './BookService';

const bookService = new BookService();

class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            search: ""
        };

        this.handleDelete = this.handleDelete.bind(this);
    }

    async componentDidMount() {
        var self = this;

        bookService.getBooks().then(function (result) {
            result = result.sort( (s1, s2) => {
                if (s1.title > s2.title) { return 1; }
                else if (s2.title > s1.title){ return -1; }
                else return 0;
            });
            self.setState({
                books: result
            })
        })
        
    }

    handleDelete(e, id){
        bookService.deleteBook( {id: id}).then( () => {
            var newArr = this.state.books.filter( (s)=> {return s.id !== id;} );
            this.setState({ books: newArr}); 
        })
    }

    handleChange = e => {
        let { value } = e.target;
        this.setState({ search: value });
    };

    render() {
        return (
                <div className="book-list">
                    {this.state.books.map( b =>
                        <div className="book-title" key={b.id}><Link to={`/book/${b.id}`}>{b.title}</Link></div>
                    )}
                </div>
        );
    }
}



export default BookList;