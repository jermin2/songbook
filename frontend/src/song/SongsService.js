import axios from 'axios';


import localforage from 'localforage';

// import PouchDB from 'pouchdb'

import SongWorker from './SongWorker';

const songWorker = new SongWorker();

const API_URL = 'http://localhost:8000';

// use the songs table
const songsTable = localforage.createInstance({
    name: "songbaseDB",
    storeName: "songs"
});
const lang = "english";

// var songDB = new PouchDB('songs');

export default class SongsService {

    static songs = [];

    async getSongs() {
        console.log("Get songs called");
        // Check database version, if its different then update
        //write to localforage songsWorker.getSongs();

        // Check if we have it in memory. If so, send it
        if( SongsService.songs && SongsService.songs.length > 0 ){

            return SongsService.songs;
            console.log("found in memory");
            const myPromise = new Promise((resolve, reject) => {
                resolve(SongsService.songs)
              });
            return myPromise;
        }
        // Second, check if its in local database. 
        const length = await songsTable.length().then( length => length);

        // if not, then download from remote database
        if(!length || length ===0 ){

            console.log("FETCH from online", length);
            
            const songs = songWorker.getSongs().then( songs => {
                //Get the list of songs from the database
                //Update the local copy
                songs.forEach( s => {
                    songsTable.setItem(s.song_id.toString(), s);
                })
                console.log("Finished updating");
                return this.getSongsFromLocal();
            })

        } else {
            console.log("found in local database")
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
            console.log('Retrieved data from local', songs.length);
            //Store into memory
            SongsService.songs = songs;
            
            return songs;
        }).catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
        });

        return list;

    }






    getSong(id){
        console.log("id", id);
        return songsTable.getItem(id.toString()).then( result => {console.log("ii", result); return result}).catch(e => console.log(e) );
    }

    deleteSong(id){
        const url = `${API_URL}/api/song/${id}`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.delete(url, headers).then(response => {
            console.log(response.data);
            alert("Success");}
         ).catch(e => {
            console.log(e);
            alert("An error occured");
        });
    }

    createSong(song){
        const url = `${API_URL}/api/song/`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.post(url,song, headers).then(response => {
            console.log(response.data);
            songsTable.setItem(response.data.song_id.toString(), response.data)
            alert("Success");}
         ).catch(e => {
            console.log(e);
            alert("An error occured");
        })
    }

    updateSong(song){
        const url = `${API_URL}/api/song/${song.song_id}/edit`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }

        return axios.put(url, song, headers).then(response => {
                console.log(response.data);
                songsTable.setItem(response.data.song_id.toString(), response.data)
                alert("Success");}
             ).catch(e => {
                console.log(e);
                alert("An error occured");
            })
    }

}