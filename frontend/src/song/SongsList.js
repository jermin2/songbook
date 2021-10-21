import React, { Component } from 'react';

import SongsService from './SongsService';

const songsService = new SongsService();

class SongsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            search: ""
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.searchFilter = this.searchFilter.bind(this);
    }

    async componentDidMount() {
        var self = this;
        songsService.getSongs().then(function (result) {
            result = result.sort( (s1, s2) => {
                if (s1.title > s2.title) { return 1; }
                else if (s2.title > s1.title){ return -1; }
                else return 0;
            });
            self.setState({
                songs: result
            })
        })
    }

    handleDelete(e, id){
        songsService.deleteSong( {id: id}).then( () => {
            var newArr = this.state.songs.filter( (s)=> {return s.id !== id;} );
            this.setState({ songs: newArr}); 
        })
    }

    // Load the song
    handleClick(id) {
        this.props.history.push(`/song/${id}`);
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
        return (
            <div className="song-list">
                <input className="search" onChange={this.handleChange} autoFocus/>
                <div className="title-list">
                    {this.state.songs.filter(this.searchFilter).map( s =>
                        <div className="song-title" key={s.id} onClick={ () => this.handleClick(s.id) } key={s.id}>{s.title}</div>
                    )}
                </div>
            </div>
        );
    }
}



export default SongsList;