import React, { Component } from 'react';

import SongsService from './SongsService';

const songsService = new SongsService();

class SongDisplay extends Component {
    constructor(props){
        super(props);
        this.state = {
            song: {
                title: "",
                text: ""
            }
        }
    }

    componentDidMount(){
        const { match: { params } } =  this.props;

        if (params && params.id){
            var self = this;
            songsService.getSong(params.id).then(function (result) {
                self.setState({
                    song: result
                })
            })
        }
    }

    parseSong = () =>{
        
        var lines = this.state.song.text.split("\r\n");
        return(
            <div className="lines">
            {lines.map( (line) => this.parseLineType(line) ) }
            </div>
        )
    }

    parseLineType = (line) => {
        if (line[0] === '#'){ return ( <div className="line">{this.parseComment(line)}</div>); } //Comments
        if (line.search( /^\d/ig) > -1 ){ 
            return ( <div className="verse-number">{line}</div>); } //Numbers
        else {  
            // Check for chords
            if (line.search(/\[/) > -1) {
                var words = line.split(" ");
                return ( <div className="line"><span className="line-text">{words.map( word => this.parseWords(word))}</span></div> ); 
            } 
            else {
                //return the line if no chords
                return ( <div className="line"><span className="line-text">{line}&nbsp;</span></div>)
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
            <span className="chord-word">{
            arr.map( word_chord => {
                // If its a chord
                if( word_chord[0] === "["){
                    const chord = word_chord.split( /\[(.*?)\]/ );
                    return ( <span className="chord">{chord[1]}</span>);
                } else {   return word_chord;  } // otherwise just return the 'part word'
            })
            }&nbsp;</span> //need a space after each word
        )
    }

    render() {
        return(
            <div className="song">{this.parseSong()}</div>
        )
    }
}

export default SongDisplay;