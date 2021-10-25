import axios from 'axios';
const API_URL = 'http://localhost:8000';

export default class BookService {

    getBooks() {
        const url = `${API_URL}/api/book/`;
        return axios.get(url).then(response => response.data).catch(e => console.log(e));
    }

    getBook(id){
        const url = `${API_URL}/api/book/${id}`;
        return axios.get(url).then(response => response.data).catch(e => console.log(e));
    }

    deleteBook(id){
        const url = `${API_URL}/api/book/${id}`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.delete(url, headers).then(response => {
            console.log(response.data);
            alert("Book deleted");}
         ).catch(e => {
            console.log(e);
            alert("An error occured");
        });
    }

    createBook(book){
        const url = `${API_URL}/api/book/`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.post(url,book, headers).then(response => {
            console.log(response.data);
            alert("Success");}
         ).catch(e => {
            console.log(e);
            alert("An error occured");
        })

    }

    updateBook(book){
        const url = `${API_URL}/api/book/${book.id}/edit`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.put(url,book, headers).then(response => {
            console.log(response.data);
            alert("Success");}
         ).catch(e => {
            console.log(e);
            alert("An error occured");
        })
    }
}