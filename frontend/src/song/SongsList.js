import { useState, useCallback, useEffect } from 'react';
import SongsService from './SongsService';
import {Bucket} from './SongListBucket'
import SongDisplay from './SongDisplay'
import BookService from '../book/BookService';

import SongHelper from './SongHelper'

const songsService = new SongsService();
const bookService = new BookService();

const songHelper = new SongHelper();

// Modes
const BOOK_EDIT = 'BOOK_EDIT'; // Allow drag and drop to add/remove songs
const BOOK_EDIT_SELECT = 'BOOK_EDIT_SELECT'; // Allow drag and drop to add/remove songs
const BOOK_LIST = 'BOOK_LIST'; // Feedback the selected song instead of displayin the song
const SONG_LIST = 'SONG_LIST'; // Selecting a song displays the song


export const SongsList = (data) => {
    const [songs, setSongs] = useState([]); // the songs to display
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [mode, setMode] = useState("");
    const [selectedSong, setSelectedSong] = useState(-1);
  

    function getSongs(){
        songsService.getSongs().then( result => {
            console.log("set songs", result);
            setSongs(result);
        });
    }

    // If we are in BOOK_EDIT_SELECT MODE and no songs
    if(mode===BOOK_EDIT_SELECT || mode===SONG_LIST){
        if(!songs || songs.length===0){
            console.log(mode);
            getSongs();
        }  
    }

    // Change modes
    useEffect( () => {
        console.log("mode changed to: ", data.mode);
        setMode(data.mode);
    },[data.mode])
    
    // What to do if a book is given / changed
    useEffect( () => {
        if(!data.book) return;
        // console.log("change in book", mode, data.book);
        if(data.mode === BOOK_EDIT) {
                // If the song and book lengths are the same do nothing
                // if( songs.length === data.book.songs.length || !data.book) return
            if(!data.book || data.book.songs.length === 0) return;

            // Get other data like title and text for each song
            const songList = songHelper.addSongData(data.book.songs);
            setSongs(songList);
        } else {
            const songList = songHelper.addSongData(data.book.songs);
            console.log("songs changed", songList );
            setSongs(songList);
        }
    },[data.book]);

    // What to do if the selected songs in the book changes..for mode = BOOK_EDIT_SELECT
    useEffect( () => {
        if(mode!==BOOK_EDIT_SELECT) return;
        if(data.selected.length === 0) return;
        if(songs.length === 0) return;
        
        const newSongList = [...songs];

        data.selected.forEach( s => {
            const selSong = newSongList.find( e => e.song_id === s.song_id );
            selSong.selected = true;
        })
        
        setSongs(newSongList);

    },[data.selected]);

    // Filter
    useEffect( () => {
        if(searchTerm.length===0){
            songs.forEach(s => s.book_title="")
            setFiltered(songs);
            
            return;
        }
        if(!isNaN(searchTerm) && searchTerm.length>0){
            const filList = songHelper.filterByIndexes(parseInt(searchTerm))
            setFiltered(filList);
            return;
        }

        const l = songs.filter(searchFilter);
        setFiltered(l);

    },[songs, searchTerm])

    function handleDelete(e, id) {
        songsService.deleteSong( {id:id} ).then( () => {
            //Remove the song from the array
            var newArr = songs.filter( (s) => {return s.song_id !== id} );
            setSongs(newArr);
        })
    };

    function handleClick(id) {
        console.log(mode, id, songs);
        if(mode===BOOK_LIST){
            // BOOK LIST mode means we just want to return the id, and let the parent handle the click
            data.setId(id);
        }
        else if(mode===BOOK_EDIT_SELECT) {
            
            // BOOK_EDIT_SELECT means we have selected the song and want to toggle the selected flag
            data.setId(id);

            const songscopy = [...songs];

            // Get index of song
            const objInd = songscopy.findIndex( (song) => song.song_id===id);

            // Toogle the selected flag
            songscopy[objInd].selected = songscopy[objInd].selected ? false : true

            // Update songs
            setSongs(songscopy)
        }
         else{
            data.history.push(`/song/${id}`);
        }
    };

    // Handle input from search box
    const handleChange = e => {
        if(e){
            let { value } = e.target;
            setSearchTerm(value);
        }
    };

    function searchFilter(song) {
        //if the search term is a number
        if(!isNaN(searchTerm) && searchTerm.length>0){
            // Search using the index
            // ONLY VALID during SONG_LIST and EDIT_BOOK_SELECT modes
            // console.log("song", song);
            const [r,bookname] = songHelper.filterByIndex(parseInt(searchTerm), song);
            song.booksong=bookname;
            return r;
            
        } else {

            // remove any chords and comments - TODO: Can we do this before hand?
            const searchString = song.text.replace(/\[(.*?)\]/img, "") //remove chords
            .replace(/#[\s\S]+?$/gim, "") //remove comments
            .replace(/(\n\r)+|(\r\n)+|\n+/img, " "); //remove new lines

            // search through the string (the 'i' flag means case insensitive)
            if (searchString.search( new RegExp(searchTerm, 'img') ) !== -1){
                return true;
            }
            return false;   
        }     
    };

    function render() {
        // if(mode==='BOOK_EDIT') console.log(mode, data);
        
        if(mode === 'BOOK_EDIT') {

            console.log("book-edit songs", songs);
            return(
            <div className="song-list">
                <input className="search" onChange={handleChange()} autoFocus placeholder="Type to search"/>
                <div className="title-list">
                    <Bucket songs={filtered} updateList={data.updateList} />
                </div>
            </div>
            )
        }

        return (
            <div> 
                <div className="song-list">
                    <input className="search" onChange={handleChange} autoFocus placeholder="Type to search"/>
                    <div className="title-list">
                        {filtered.map( s =>
                            <div className="song-item" data-selected={s.selected} data-key={s.song_id} key={s.id ? s.id : s.song_id} onClick={() => handleClick(s.song_id)}>
                           
                           { s.index && <div className="song-index">#{s.index}</div>} 
                           { s.book_title && <div className="song-book-info"> {s.book_title}</div>}
                           <div className="song-title">{s.title}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    {/* Used during book edit (this is the right hand side) */}
                    {selectedSong > -1 && 
                        <div className="book-display-song">
                            < SongDisplay id={selectedSong} />
                        </div>
                    }
                </div>
            </div>
        );
    };
    if (!songs || songs.length===0){
        // console.log("apparently no songs?", songs)
        // getSongs();
        // console.log("no songs at all??", data)
        return <>NO SONGS</>
    } else
    return (<> {render()} </>)
};