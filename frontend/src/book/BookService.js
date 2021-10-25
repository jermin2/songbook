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
        const url = `${API_URL}/api/edit/book/${id}`;
        return axios.delete(url);
    }

    createBook(book){
        const url = `${API_URL}/api/edit/book/`;
        return axios.post(url,book).then(response => response.data);
    }

    updateBook(book){
        const url = `${API_URL}/api/edit/book/${book.id}/edit`;
        const token = sessionStorage.getItem("token");
        return axios.put(url, book, {
            headers: { "Authorization": `Bearer ${token}` },
            
        }).then(response => {
            console.log(response.data)
        })
    }
}