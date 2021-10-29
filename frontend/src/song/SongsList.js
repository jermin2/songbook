import { useState, useEffect } from 'react';
import SongsService from './SongsService';
import {Bucket} from './SongListBucket'

import SongHelper from './SongHelper'

const songsService = new SongsService();

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

    // How many songs to display at a time
    const [songLimit, setSongLimit] = useState(100);
  
    useEffect( () => {
        window.addEventListener("scroll", (e) => {handleScroll(e)});
    })

    // Display more songs if we are near the bottom of the screen
    function handleScroll(e){
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if(scrollTop + (clientHeight*2) > scrollHeight){
            setSongLimit(songLimit+100);
        }
    }
    // If we change mode to BOOK_EDIT_SELECT or SONG_LIST
    useEffect( () => {
        // If we are in BOOK_EDIT_SELECT MODE and no songs
        if(mode===BOOK_EDIT_SELECT || mode===SONG_LIST){
            if(!songs || songs.length===0){
                
                songsService.getSongs().then( result => {
                    setSongs(result);
                });
            }  
        }
    },[mode])


    // Change modes
    useEffect( () => {
        console.log("mode changed to: ", data.mode);
        setMode(data.mode);
    },[data.mode])
    
    // What to do if a book is given / changed
    useEffect( () => {
        if(!data.book || !data.book.songs || data.book.book_id===-1) return;
        console.log("change in book", mode, data.book);
        if(data.mode === BOOK_EDIT) {
                // If the song and book lengths are the same do nothing
                // if( songs.length === data.book.songs.length || !data.book) return
            if(!data.book || data.book.songs.length === 0) return;
        }
        else {
            // Get other data like title and text for each song
            songHelper.addSongData(data.book.songs).then( result => {
                console.log("songs changed", result );
                setSongs(result);
            })
        }
    // eslint-disable-next-line
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

        // eslint-disable-next-line
    },[data.selected, mode]);

    // Filter
    useEffect( () => {

        var list = [];
        if(!songs || songs.length===0) return;

        // If there is no search term
        if(searchTerm.length===0){
            songs.forEach(s => s.book_title="")
            list = songs;
        } else
        // if search term is a number and greater than 0
        if(!isNaN(searchTerm) && searchTerm.length>0){

            songHelper.filterByIndexes(parseInt(searchTerm)).then(result => {
                list = result;
                console.log("index search", list);
                setFiltered(list);
                return;
            });

            //Normal search term
        } else {
            // Apply the filter
            list = songs.filter(searchFilter);
        }
        
        // Slice to reduce the number of songs shown on screen
        setFiltered(list.slice(0,songLimit));
        // setFiltered(songs);

        // eslint-disable-next-line
    },[songs, searchTerm, songLimit])

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

    function onScroll(e) {
        if(e){
            console.log(e);
        }
    }

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
            const searchString = song.lyrics.replace(/\[(.*?)\]/img, "") //remove chords
            .replace(/#[\s\S]+?$/gim, "") //remove comments
            .replace(/(\n\r)+|(\r\n)+|\n+/img, " "); //remove new lines

            // search through the string (the 'i' flag means case insensitive)
            if (searchString.search( new RegExp(searchTerm, 'img') ) !== -1){
                return true;
            }
            return false;   
        }     
    };

    if (!songs || songs.length===0){
        return <>NO SONGS</>
    }
    if(mode === 'BOOK_EDIT') {

        return(
        <div className="song-list">
            <input className="search" onChange={handleChange()} autoFocus placeholder="Type to search"/>
            <div className="title-list">
                <Bucket songs={filtered} updateList={data.updateList} />
            </div>
        </div>
        )
    }
    // For all other modes, return this
    return (      
        <div onScroll={()=>{console.log("scroll")}}> 
            <div className="song-list" onScroll={()=>{console.log("scroll")}}>
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
        </div>
    );

};