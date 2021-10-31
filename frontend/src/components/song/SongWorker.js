import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default class SongWorker {

    getSongs() {
        const url = `${API_URL}/api/song/`;
        return axios.get(url).then(response => {
            console.log("Fetched ", response.data.length)
            return response.data }).catch(e => console.log(e));
    }

}