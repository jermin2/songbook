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
        let { name, value } = e.target;
        this.setState({ search: value });
    };

    searchFilter(song){
        // remove any chords and comments
        
        const search = this.state.search;

        // Remove the chords and newlines from the string
        const searchString = song.text.replace(/\[(.*?)\]/im, "").replace(/\n\r|\r\n|\n/img, " ");

        // search through the string (the 'i' flag means case insensitive)
        if (searchString.search( new RegExp(search, 'img') ) !== -1){
            return true;
        }
        return false;
    }


    render() {
        return (
            <div className="song-list">
                <input onChange={this.handleChange} />
                <ul>
                    {this.state.songs.filter(this.searchFilter).map( s =>
                        <li onClick={ () => this.handleClick(s.id) } key={s.id}>{s.title}</li>
                    )}
                </ul>
            </div>
        );
    }
}



export default SongsList;