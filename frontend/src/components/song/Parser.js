/*
Page
Area
Index
Song
*/


/*
Given the right lyrics, can parse the song into React HTML elements. No styling is included

*/
export default class Parser {

    // Replace all the weird new line stuff with \n
    sanitize = (text) => {
        var song_text_sanitised = text.replace(/(\r\n)|\r|\n/igm, '\n')
        return song_text_sanitised;
    }


    parseBook = (text) => {
        const sanitized_text = this.sanitize(text);
        
        //$1 means songs 1
        const song_blocks = sanitized_text.split('$');
        
        //Check each block starts with a number
        return (
            <>
            { song_blocks.map( (song_block, itr) => this.parseSongBlock(song_block, itr) )}
            </>
        )
    }

    parseSongBlockWithIndex = (song_block, itr) => {

        //check if it starts with a new line
        if(song_block.startsWith('\n')){
            var text = song_block;
            text = text.replace('\n',"")
            return (
                <div><div className="line" key={`g-${itr}`}>&nbsp;
                {this.parseSongBlockWithIndex(text, itr)}</div>
                </div>
            )
        }
        if(song_block.length===0){
            return ( <div>
                <div className="line" key={`g-${itr}`}>&nbsp;</div>
                <div className="line" key={`g-${itr+1}`}>&nbsp;</div>
                </div>
            );
        }
        if(song_block.startsWith('$')){
            //find the index
            const match_results = song_block.match(/\$(\d)+/);
            // console.log(match_results); 

            if(match_results===null) {
                console.log(match_results, song_block, "match results");
                // console.log(match_results[0].length, match_results[1].length, "match results");
                return;
            }

            const song_num = match_results[1]// the [1] is to get the capture group
            //slice to get the rest of the song
            const len = match_results[0].length
            const new_song_block = song_block.slice(len)

            return ( <>
                <div className="book-song" key={itr}>
                <div className="song-number" key={`${itr}`}>{song_num}</div> 
                {this.parseSong(new_song_block)}
                </div>
                </>
                ); 
    }    else return (
            <>
            {this.parseSong(song_block)}
            </>
        );
    }
    parseSongBlock = (song_block, itr) => {

        //The first line of the block should be the index number
        const firstLineSplit = song_block.split('\n')
        const firstLine = firstLineSplit[0];

        const song_text = song_block.replace(firstLine, '');

        // if the first line starts with $1 (this means it is a song index)
        if (firstLine.search( /^\d/ig) > -1 ){ 
            return ( 
            <div className="book-song" key={itr}>
            <div className="song-number" key={`${itr}`}>{firstLine}</div> 
            {this.parseSong(song_text)}
            <div className="line" key={`g-${itr}`}>&nbsp;</div>
            </div>
            ); 
        } 

        else return (
            <>
            {this.parseSong(song_block)}
            </>
        );
    }

    parseSong = (song_text) =>{

        

        // if song_text doesn't exist, then return
        if (!song_text) return <div></div>

        // Sanitize the inputs
        const song_text_sanitised = this.sanitize(song_text)
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

}