import React, { Component } from 'react'

import BookService from './BookService'

import SongsList from '../song/SongsList'
import SongDisplay from '../song/SongDisplay'


const bookService = new BookService()

class BookDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: {
                id: -1,
                title: "",
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
            if (parseInt(params.id) !== this.state.book.id) {
                var self = this;

                //Fetch the new book
                bookService.getBook(params.id).then(function(result) {
                    self.setState({
                        book: result,
                        selectedSong: result.songs[0]
                    })
                })
            }
        }
    }

    // Callback function used by songlist to indicate a selection of a song
    setId(id){
        this.setState({
            selectedSong: id
        })
    }

    render() {
        return (
            <div className="book-display-parent">
                <div className="book-display">
                    <h2 className="book-name">{this.state.book.title}</h2>
                    < SongsList book={this.state.book} widescreen={true} setId={this.setId}/>
                </div>
                { this.state.selectedSong > -1 &&
                    <div className="book-display-song">
                        < SongDisplay id={this.state.selectedSong} widescreen={this.state.widescreen}/>
                    </div>
                }
            </div>
            
        )
    }
}

export default BookDisplay