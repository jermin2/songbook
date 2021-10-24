import React, { Component } from 'react';

import SongsService from './SongsService';
import SongDisplay from './SongDisplay'

import {Bucket} from './SongListBucket'


const songsService = new SongsService();

// Modes
const BOOK_EDIT = 'BOOK_EDIT'; // Allow drag and drop to add/remove songs
const BOOK_EDIT_SELECT = 'BOOK_EDIT_SELECT'; // Allow drag and drop to add/remove songs
const BOOK_LIST = 'BOOK_LIST'; // Feedback the selected song instead of displayin the song
const SONG_LIST = 'SONG_LIST'; // Selecting a song displays the song

class SongsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            sorted_songs: [],
            search: "",
            book: {
                songs: []
            },
            mode: SONG_LIST,
            selectedSong: -1
        };


        this.handleDelete = this.handleDelete.bind(this);
        this.searchFilter = this.searchFilter.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }


    async componentDidMount() {
        var self = this;

        // Get a list of all the songs then sort them
        songsService.getSongs().then(function (result) {
            result = result.sort( (s1, s2) => {
                if (s1.title > s2.title) { return 1; }
                else if (s2.title > s1.title){ return -1; }
                else return 0;
            });
            const mode = self.props.mode ? self.props.mode : SONG_LIST
            self.setState({
                songs: result,
                sorted_songs: result,
                mode: mode
            })
        })
        
    }

    componentDidUpdate(preProps, prevState) {

        // If a new book is being given, and it is different from the existing book
        if(this.props.book && (this.state.book !== this.props.book )) {
            

            if(this.state.mode === BOOK_EDIT ){
                // If the song lists are the same length, then nothing to edit
                if (this.state.songs.length === this.props.book.songs.length) {
                    return;
                }

                const songsList = []

                // Using the given book list (its in [3,4] format), crosscheck with the database to get all the other info like title
                this.props.book.songs.forEach( s => {
                    const k = this.state.sorted_songs.find( e => e.id === s) 
                    
                    // While we are at it, all the songs in props should have the selected tag set to true

                    songsList.push(k)
                } )

                //  set the new state
                this.setState({
                    songs: songsList
                })
            } 
            else
            {
                 
                //filter the list of songs by the songs in the book
                const songs = this.state.sorted_songs.filter( (song) => {
                    return this.props.book.songs.includes(song.id)
                })

                this.setState({
                    songs: songs,
                    book: this.props.book
                })

            }
        }
        else if (this.state.mode === BOOK_EDIT_SELECT && preProps.selected.length !== this.props.selected.length) {
            const newSongList = [...this.state.sorted_songs];
            this.props.selected.forEach( s => {
                const selSong = newSongList.find( e => e.id === s);
                selSong.selected = true;
            })

            this.setState({
                songs: newSongList
            })
        }
    }

    handleDelete(e, id){
        songsService.deleteSong( {id: id}).then( () => {
            var newArr = this.state.songs.filter( (s)=> {return s.id !== id;} );
            this.setState({ songs: newArr}); 
        })
    }

    // Handle clicking on song. If the input_song flag is set, feedback the song id instead of pushing it to the url
    handleClick(id) {


        if(this.state.mode === BOOK_LIST){
            this.props.setId(id);
        }
        // BOOK_EDIT_SELECT - select a song. 
        else if(this.state.mode === BOOK_EDIT_SELECT) {
            this.props.setId(id);

            // Make a copy of the state
            const songState = [...this.state.songs]

            // Get the index in the array of the song
            const ind = songState.findIndex( (song) => song.id === id);
            
            // Get the song
            const selected_song = songState[ind];

            // Set the selected flag or toggle it
            selected_song.selected  = selected_song.selected ? false : true;
            
            // replace the song in the list of songs
            songState[ind] = selected_song;

            // write out the new state
            this.setState({
                songs: songState
            })
        }
        else {
            this.props.history.push(`/song/${id}`);
        }
        
    }

    handleChange = e => {
        let { value } = e.target;
        this.setState({ search: value });
    };

    searchFilter(song){
        // remove any chords and comments
        
        const search = this.state.search;

        // Remove the chords, comments, newlines from the string
        const searchString = song.text.replace(/\[(.*?)\]/img, "") //remove chords
        .replace(/#[\s\S]+?$/gim, "") //remove comments
        .replace(/(\n\r)+|(\r\n)+|\n+/img, " "); //remove new lines
        
        // search through the string (the 'i' flag means case insensitive)
        if (searchString.search( new RegExp(search, 'img') ) !== -1){
            return true;
        }
        return false;
    }


    render() {

        if(this.state.mode === 'BOOK_EDIT') {
            return(
            <div className="song-list">
                <input className="search" onChange={this.handleChange} autoFocus/>
                <div className="title-list">
                    < Bucket songs={this.state.songs.filter(this.searchFilter)} updateList={this.props.updateList} />
                </div>
            </div>
            )
        }

        return (
            <div> 
                <div className="song-list">
                    <input className="search" onChange={this.handleChange} autoFocus/>
                    <div className="title-list">
                        {/* < Bucket songs={this.state.songs} /> */}
                        {this.state.songs.filter(this.searchFilter).map( s =>
                            <div className="song-title" data-selected={s.selected} data-key={s.id} key={s.id} onClick={()=>this.handleClick(s.id)}>
                            {s.title}</div>
                        )}
                    </div>
                </div>
                <div>
                    { this.state.selectedSong > -1 && 
                        <div className="book-display-song">
                            < SongDisplay id={this.state.selectedSong} />
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default SongsList