import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class SongsService {

    getSongs() {
        const url = `${API_URL}/api/song/`;
        return axios.get(url).then(response => response.data).catch(e => console.log(e));
    }

    getSong(id){
        const url = `${API_URL}/api/song/${id}`;
        return axios.get(url).then(response => response.data).catch(e => console.log(e));
    }

    deleteSong(id){
        const url = `${API_URL}/api/song/${id}`;
        return axios.delete(url);
    }

    createSong(song){
        const url = `${API_URL}/api/song/`;
        return axios.post(url,song).then(response => response.data);
    }

    updateSong(song){
        const url = `${API_URL}/api/song/${song.id}`;
        return axios.put(url, song);
    }
}