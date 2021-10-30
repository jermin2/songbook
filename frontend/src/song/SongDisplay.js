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


        document.body.style.overflow = 'visible';

    }

    getUniqueId(){
        this.uniqueId = this.uniqueId + 1;
        return this.uniqueId;
    }

    getSong(id){
        if(parseInt(this.state.song.song_id) === parseInt(id)) { return false; }
        var self = this;
        console.log("get song called", id);
        songsService.getSong(id).then(function (result) {
            console.log("get song called r", result);
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
            if (params && params.id){
                return this.getSong(params.id);
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
        // if song_text doesn't exist, then return
        if (!song_text) return <div></div>

        // Sanitize the inputs
        var song_text_sanitised = song_text.replace(/(\r\n)|\r|\n/igm, '\n')
        var blocks = song_text_sanitised.split("\n\n");
        
        return( <>
            {blocks.map( (block, itr) => this.parseBlock(block, itr) ) }
            </>
        )
    }

    parseBlock = (block, itr) => {

        var lines = block.split("\n");

        // c for chorus
        if (block.startsWith("c\n") ) {
            // Remove the "c"
            lines.splice(0,1)
            return (
                <div key={`b-${itr}`}>
                <div className="chorus" key={`c-${itr}`}>
                {lines.map( (line, itr) => this.parseLineType(line, itr) ) }
                </div>
                <div className="line" key={`space-${itr}`}>&nbsp;</div>
                </div>
            )
        } else if (block.startsWith("  ")){ //songbase version starts with 2 spaces
            return (
                <div key={`b-${itr}`}>
                <div className="chorus" key={`c-${itr}`}>
                {lines.map( (line, itr) => this.parseLineType(line.trim(), itr) ) }
                </div>
                <div className="line" key={`g-${itr}`}>&nbsp;</div>
                </div>
            )
        }
        return(
            <div key={`b-${itr}`}>
            <div className="verse" key={`v-${itr}`}>
            {lines.map( (line, itr) => this.parseLineType(line, itr) ) }
            
            </div>
            <div className="line" key={`g-${itr}`}>&nbsp;</div>
            </div>
        )
    }

    parseLineType = (line, itr) => {
        if (line[0] === '#'){ return ( <div className="line" key={`${itr}`}>{this.parseComment(line)}</div>); } //Comments
        if (line.search( /^\d/ig) > -1 ){ 
            return ( <div className="verse-number" key={`${itr}`}>{line}</div>); } //Numbers
        else {  
            // Check for chords
            if (line.search(/\[/) > -1) {
                var words = line.split(" ");
                return ( <div className="line" key={`${itr}`}><span className="line-text">{words.map( (word, itr) => this.parseWords(word, itr))}</span></div> ); 
            } 
            else {
                //return the line if no chords
                return ( <div className="line" key={`${itr}`}><span className="line-text">{line}&nbsp;</span></div>)
            }
        }
    }
    parseComment = (comment) => {
        const commented_edit = comment.split(/^#\s*/gm);
        return ( <span className="comment"><em>{commented_edit[1]}</em></span> )
    }

    parseWords = (word, itr) => {
        // Chords in the word
        // Split the word in the case of multiple chords - chord-word
        const arr = word.split ( /(\[.*?\])/ );

        return (
            <span className="chord-word" key={itr}>{
            arr.map( (word_chord, itrc) => {
                // If its a chord
                if( word_chord[0] === "["){
                    const chord = word_chord.split( /\[(.*?)\]/ );
                    return ( <span className="chord" key={itrc}>{chord[1]}</span>);
                } else {   return word_chord;  } // otherwise just return the 'part word'
            })
            }&nbsp;</span> //need a space after each word
        )
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