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
        return axios.delete(url);
    }

    createBook(book){
        const url = `${API_URL}/api/book/`;
        return axios.post(url,book).then(response => response.data);
    }

    updateBook(book){
        const url = `${API_URL}/api/book/${book.id}`;
        return axios.put(url, book);
    }
}