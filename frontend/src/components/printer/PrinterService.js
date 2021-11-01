import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class PrinterService {

    create(page){
        //do something
        const url = `${API_URL}/api/printer/`;
        // const token = sessionStorage.getItem("token");
        // const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.post(url,page).then(response => {
            alert("New Print Settings Created");
            return response.data;}
         ).catch(e => {
            console.log(e, page);
            alert("An error occured");
        })
    }

    save(page, id){
        const url = `${API_URL}/api/printer/${id}/`;
        return axios.put(url, page).then(response => {
            alert("Saved!");
            return response.data
        }).catch( e=> {
            console.log(e);
            alert("error happened");
        })
    }

    edit(page){
        //do something
        const url = `${API_URL}/api/printer/`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.post(url,page, headers).then(response => {
            console.log(response.data);
            alert("Success");}
         ).catch(e => {
            console.log(e, page);
            alert("An error occured");
        })
    }

    get(id){
        const url = `${API_URL}/api/printer/${id}/`;
        return axios.get(url).then(response => {
            alert("success");
            return response.data
        })
    }

    getAll(){
        const url = `${API_URL}/api/printer/`;
        return axios.get(url).then(response => {
            console.log(response.data);
            // alert("success");
            return response.data
        })
    }
}