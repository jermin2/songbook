import React, { Component } from 'react'

import BookService from './BookService'

import SongsList from '../song/SongsList'


const bookService = new BookService()

class BookEdit extends Component {
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
        this.updateList = this.updateList.bind(this);
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
                console.log("fetch new book");
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
        // the id of the book needs to be passed into the bucket
        //check if id exists. if it does, remove it otherwise add it
        const songs = this.state.book.songs;
        const newlist = songs.includes(id) ? songs.filter(e => e !== id) : [...songs,id];

        if (newlist.length > 0) {
            this.setState({
                book: {...this.state.book, songs: newlist }
            })
        }
    }

    // Callback from the drag and drop list
    updateList(list){
        // Flatten the songs since we only want the ids
        const newList = list.flatMap( e => e.id)

        // Only change the state if the length is > 0 - WARNING, removing this will break the program
        if (newList.length > 0) {
            this.setState({
                book: {...this.state.book, songs: newList }
            })
        }
    }

    // TO DELETE
    handleClick = () => {
        console.log("click");
        console.log(this.state.book.songs)
    }


    render() {
        return (
            
            <div className="book-edit-parent widescreen-parent">
                <div className="book-edit widescreen">
                    <h2 className="book-name ">{this.state.book.title}</h2>
                    <button className="btn btn-primary" onClick={this.handleClick}>Save</button>
                    < SongsList book={this.state.book} mode={'BOOK_EDIT'} updateList={this.updateList}/>
                </div>
                <div className="book-edit-songlist widescreen">
                    < SongsList showSong={false} setId={this.setId} mode={'BOOK_EDIT_SELECT'} selected={this.state.book.songs}/>
                </div>
            </div>

        )
    }
}

export default BookEdit