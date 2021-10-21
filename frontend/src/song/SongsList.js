import React, { Component } from 'react';

import SongsService from './SongsService';

const songsService = new SongsService();

class SongsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: []
        };

        this.handleDelete = this.handleDelete.bind(this);
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

    render() {
        return (
            <div className="song-list">
                <ul>
                    {this.state.songs.map( s =>
                        <li onClick={ () => this.handleClick(s.id) } key={s.id}>{s.title}</li>
                    )}
                </ul>
            </div>
        );
    }
}



export default SongsList;