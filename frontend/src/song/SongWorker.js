import axios from 'axios';


import localForage from 'localforage';

const API_URL = 'http://localhost:8000';

export default class SongWorker {
    constructor(){
        
    }

    //in index.js

    getSongs() {
        const url = `${API_URL}/api/song/`;
        return axios.get(url).then(response => {
            console.log("Fetched ", response.data.length)
            return response.data }).catch(e => console.log(e));
    }

    getSong(id){
        const url = `${API_URL}/api/song/${id}/`;
        return axios.get(url).then(response => response.data).catch(e => console.log(e));
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
                alert("Success");}
             ).catch(e => {
                console.log(e);
                alert("An error occured");
            })
    }

}