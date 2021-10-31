import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class PrinterService {

    save(page){
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

    getPrintPage(id){
        const url = `${API_URL}/api/printer/${id}`;
        return axios.get(url).then(response => {
            console.log(response.data);
            alert("success");
            return response.data
        })
    }
}