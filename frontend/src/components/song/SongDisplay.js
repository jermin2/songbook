import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import SongsService from './SongsService';

import Parser from './Parser'

const songsService = new SongsService();
const parser = new Parser();

class SongDisplay extends Component {
    constructor(props){
        super(props);
        this.state = {
            song: {
                id: -1,
                title: "",
                text: ""
            }
        }

        // const uniqueId = 0;
    }

    componentDidMount(){

        const id = this.props.id;
        if( id ){
            return this.getSong(id);
        }
        else {
            
            // if params are also invalid return nothing
            if( !this.props.match ) return;

            // Handle URL
            const { match: { params } } =  this.props;
            if (params && params.id){
                return this.getSong(params.id);
            }
        }

        document.body.style.overflow = 'visible';

    }

    getUniqueId(){
        this.uniqueId = this.uniqueId + 1;
        return this.uniqueId;
    }

    getSong(id){
        if(parseInt(this.state.song.song_id) === parseInt(id)) { return false; }
        var self = this;
        songsService.getSong(id).then(function (result) {
            self.setState({
                song: result
            })
        })
        
    }

    componentDidUpdate(prevProps){

        // No need to load a song, the song is given directly
        if (this.props.mode && this.props.mode === "BY_SONG") {
            
            // if the song didn't change, no need to udpate
            if(prevProps === this.props){
                return
            }
            // return 
            this.setState({
                song: this.props.song
            })
            return;
        }
        document.body.style.overflow = 'visible';
        // load a song from memory
        const id = this.props.id;
        if( id ){
            return this.getSong(id);
        }
        // load a song via URL
        else {
            // Handle URL
            const { match: { params } } =  this.props;
            if (params && params.id && params.id !== this.state.song_id){
                // return this.getSong(params.id);
            }
        }
    }

    parseSong = () =>{

        //If in SONG_MODE, then parse the song from props instead of state
        if (this.props.mode && this.props.mode === "BY_SONG" ) {
            var song_text = this.props.song.lyrics
        }
        else {
            song_text = this.state.song.lyrics
        }

        return parser.parseSong(song_text);
    }

    render() {
        if(this.props.widescreen){
            // console.log("return a")
            return (
                <div className="song-display-parent" >
                    <div className="links-parent">
                        {this.props.userLoggedIn && 
                        <Link className="control-link" to={`/song/${this.state.song.song_id}/edit`}>Edit</Link>
                        }
                        <Link className="control-link" to={`/song/${this.state.song.song_id}`}>Full Screen</Link>
                    </div>
                    <div>
                        <div className="song-display-title">{this.state.song.title}</div>
                    <div className="song">{this.parseSong()}</div>
                    </div>
                </div>
            )
        }
        else {
            // console.log('return b')
            return(
                <div className="song-display-parent">
                    {this.props.userLoggedIn && 
                    <div className="links-parent">
                        <Link className="control-link" to={`/song/${this.state.song.song_id}/edit`}>Edit</Link>
                    </div>
                    }
                    <div className="song-display-title">{this.state.song.title}</div>
                    <div className="song">{this.parseSong()}</div>
                </div>
            )
        }
    }
}

export default SongDisplay;