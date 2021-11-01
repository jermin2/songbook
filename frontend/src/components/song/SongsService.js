import localforage from 'localforage';
import SongWorker from './SongWorker';

const songWorker = new SongWorker();


// use the songs table
const songsTable = localforage.createInstance({
    name: "songbaseDB",
    storeName: "songs"
});
const lang = "english";

export default class SongsService {
    constructor(){
    if (SongsService._instance) {
        return SongsService._instance
      }
      SongsService._instance = this;

      this.checkUpdate();
    }

    songs = [];

    async checkUpdate(){
        const remoteStats = await songWorker.getUpdate();
        const length = await songsTable.length().then( length => length);
        if(length !== remoteStats.songs){
            console.log("update!", length, remoteStats.songs);
            songWorker.fetchSongs().then( songs => {
                //Get the list of songs from the database
                //Update the local copy
                songs.forEach( s => {
                    songsTable.setItem(s.song_id.toString(), s);
                })
            })
        }
    }

    async getSongs() {
        

        console.log("Get songs called");
        // Check database version, if its different then update
        //write to localforage songsWorker.getSongs();

        // Check if we have it in memory. If so, send it
        if( this.songs && this.songs.length > 0 ){
            return this.songs;
        }
        // Second, check if we have a local copy
        const length = await songsTable.length().then( length => length);

        // if not, then download from remote database
        if(!length || length ===0 ){

            console.log("FETCH from online", length);
            
            songWorker.fetchSongs().then( songs => {
                //Get the list of songs from the database
                //Update the local copy
                for (const song of songs){
                    songsTable.setItem(song.song_id.toString(), song);
                }

                return this.getSongsFromLocal();
            })

        } else {
            const songs = await this.getSongsFromLocal();
            return songs;
        }
    }


    // Load songs from local database
    async getSongsFromLocal(){
        // Iterate over local database (it should've synced)
        const songs = [];
        const list = await songsTable.iterate(function(value, key, iterationNumber) {
            
            // only get for the language setting
            if(value.lang === lang) {
                songs.push(value);
            }
            
        }).then(function() {
            console.log('Loaded ', songs.length, " songs from database");
            //Store into memory
            SongsService.songs = songs;
            
            return songs;
        }).catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
        });

        return list;

    }


    async getSong(id){
        // Check if song exists in local database.
        // If not, retrieve it from the remote database
        const s = await songsTable.getItem(id.toString());
        
        if(s){ return s;
        } else {
            // Try to retrieve from remote
            return await songWorker.fetchSong(id).then( response => {
                songsTable.setItem(response.song_id.toString(), response.song_id)
                return response;
            }).catch ( e => {
                console.log(e);
                return {title:"This song doesn't exist", lyrics:"Are you sure you typed it in right?"}
            })
        }
    }

    deleteSong(id){
        songWorker.deleteSong(id).then( response => {
            alert("Song Deleted");
            songsTable.removeItem(id);
        }).catch(e => {
            console.log(e);
            alert("An error occured");
        });
    }

    createSong(song){
        return songWorker.createSong(song).then( response => {
            console.log(response);
            songsTable.setItem(response.song_id.toString(), response)
            alert("Success");
            return response
        }).catch(e => {
            console.log(e);
            alert("An error occured");
        })
    }

    updateSong(song){
        return songWorker.updateSong(song).then( response => {
            console.log(response);
            // update local database
            songsTable.setItem(response.song_id.toString(), response)
            alert("Success");
            return response;
        }).catch( e=> {
            console.log(e);
        })
    }




}