import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import SongsService from './SongsService';

const songsService = new SongsService();

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

        // load a song from memory
        const id = this.props.id;
        if( id ){
            return this.getSong(id);
        }
        // load a song via URL
        else {
            // Handle URL
            const { match: { params } } =  this.props;
            if (params && params.id){
                return this.getSong(params.id);
            }
        }
    }

    parseSong = () =>{

        //If in SONG_MODE, then parse the song from props instead of state
        if (this.props.mode && this.props.mode === "BY_SONG" ) {
            var song_text = this.props.song.text
        }
        else {
            song_text = this.state.song.text
        }

        // Sanitize the inputs
        var song_text_sanitised = song_text.replace(/(\r\n)|\r|\n/igm, '\n')
        var blocks = song_text_sanitised.split("\n\n");
        
        return( <>
            {blocks.map( (block) => this.parseBlock(block) ) }
            </>
        )
    }

    parseBlock = (block) => {

        var lines = block.split("\n");

        if (block.startsWith("c\n") ) {
            // Remove the "c"
            lines.splice(0,1)
            return (
                <>
                <div className="chorus">
                {lines.map( (line) => this.parseLineType(line) ) }
                </div>
                <div className="line">&nbsp;</div>
                </>
            )
        }
        return(
            <>
            <div className="verse">
            {lines.map( (line) => this.parseLineType(line) ) }
            
            </div>
            <div className="line">&nbsp;</div>
            </>
        )
    }

    parseLineType = (line) => {
        if (line[0] === '#'){ return ( <div className="line" key={this.getUniqueId}>{this.parseComment(line)}</div>); } //Comments
        if (line.search( /^\d/ig) > -1 ){ 
            return ( <div className="verse-number">{line}</div>); } //Numbers
        else {  
            // Check for chords
            if (line.search(/\[/) > -1) {
                var words = line.split(" ");
                return ( <div className="line" key={line}><span className="line-text">{words.map( word => this.parseWords(word))}</span></div> ); 
            } 
            else {
                //return the line if no chords
                return ( <div className="line" key={line}><span className="line-text">{line}&nbsp;</span></div>)
            }
        }
    }
    parseComment = (comment) => {
        const commented_edit = comment.split(/^#\s*/gm);
        return ( <span className="comment"><em>{commented_edit[1]}</em></span> )
    }

    parseWords = (word) => {
        // Chords in the word
        // Split the word in the case of multiple chords - chord-word
        const arr = word.split ( /(\[.*?\])/ );

        return (
            <span className="chord-word" key={word}>{
            arr.map( word_chord => {
                // If its a chord
                if( word_chord[0] === "["){
                    const chord = word_chord.split( /\[(.*?)\]/ );
                    return ( <span className="chord" key={word_chord}>{chord[1]}</span>);
                } else {   return word_chord;  } // otherwise just return the 'part word'
            })
            }&nbsp;</span> //need a space after each word
        )
    }

    render() {
        console.log(this.props);
        if(this.props.widescreen){
            
            return (
                <div>
                    <div className="links-parent">
                        {this.props.userLoggedIn && 
                        <Link className="control-link" to={`/song/${this.state.song.song_id}/edit`}>Edit</Link>
                        }
                        <Link className="control-link" to={`/song/${this.state.song.song_id}`}>Full Screen</Link>
                    </div>
                    <div>
                        <div className="song-display-title">{this.state.song.title}title</div>
                    <div className="song">{this.parseSong()}</div>
                    </div>
                </div>
            )
        }
        else {
            return(
                <div>
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