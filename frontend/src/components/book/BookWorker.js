import axios from 'axios';

const API_URL = 'http://localhost:8000';

axios.defaults.xsrfHeaderName = 'x-csrftoken'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

// `timeout` specifies the number of milliseconds before the request times out.
// Because we enable Django Debug Toolbar for local development, there is often
// a processing hit. This can also be tremendously bad with unoptimized queries.
let defaultTimeout = 30000
if (process.env.PROD) {
    API_URL = 'https://##.##.#.##:###'
  defaultTimeout = 10000
}
axios.defaults.baseURL = API_URL
axios.defaults.timeout = defaultTimeout



export default class BookWorker {

    fetchBooks() {
        const url = `${API_URL}/api/book/`;
        return axios.get(url).then(response => {
            console.log("Fetched ", response.data.length, "books")
            return response.data }).catch(e => console.log(e));
    }

    fetchBook(id) {
        const url = `${API_URL}/api/book/${id}`;
        return axios.get(url).then(response => {
            console.log("Fetched ", response.data)
            return response.data }).catch(e => console.log(e));
    }


    updateBook(book){
        const url = `${API_URL}/api/book/${book.book_id}/edit`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.put(url,book, headers).then(response => {
            alert("Success");
            return (response);
        }).catch(e => {
            console.log(e);
            alert("An error occured");
        })
    }

    createBook(book){
        const url = `${API_URL}/api/book/`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.post(url,book, headers).then(response => {
            return response.data;
        }
         ).catch(e => {
            console.log(e);
            alert("An error occured");
        })
    }

    deleteBook(id){
        const url = `${API_URL}/api/book/${id}`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.delete(url, headers).then(response => {
            return response.data
        }
         ).catch(e => {
            console.log(e);
            alert("An error occured");
        });
    }

    getUpdate(){
        const url = `${API_URL}/api/update`;
        return axios.get(url).then(response => {
            return response.data
        }
         ).catch(e => {
            console.log(e);
            alert("An error occured");
        });    
    }



}