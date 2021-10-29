import axios from 'axios';


import localforage from 'localforage';

const API_URL = 'http://localhost:8000';

// use the songs table
const booksTable = localforage.createInstance({
    name: "songbaseDB",
    storeName: "books"
});
const lang = "english";


export default class BookService {

    static books = [];


    getBooks() {
        console.log("get books called");
        //Check if we have it in memory
        if (BookService.books && BookService.books.length > 0) {
            console.log("found in memory");
            const myPromise = new Promise((resolve, reject) => {
                resolve(BookService.books)
              });
            return myPromise;
        }
        //Check if we ahve it in local storage
        booksTable.length().then( length => {
            if(length === 0){
                //Download from remote
                console.log("Fetch list");
                this.fetchBooks().then( books => {

                    //Store in local storage
                    books.forEach( book => {
                        booksTable.setItem( book.book_id.toString(), book)
                    })
                    
                })

            }
        })

        // Iterate over local database (it should've synced)
        const books = [];
        return booksTable.iterate(function(value, key, iterationNumber) {
            
            // only get for the language setting
            if(value.lang === lang) {
                books.push(value);
            }
            
        }).then(function() {
            console.log('Retrieved book data from local', books.length);
            //Store into memory
            BookService.books = books;
            
            return BookService.books;
        }).catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
        });


    }

    fetchBooks() {

        const url = `${API_URL}/api/book/`;
        return axios.get(url).then(response => response.data).catch(e => console.log(e));
    }

    getBook(id){

        return booksTable.getItem(id.toString()).then( result => result).catch(e => console.log(e) );
        const url = `${API_URL}/api/book/${id}`;
        return axios.get(url).then(response => response.data).catch(e => console.log(e));
    }

    getBookSongs(){
        const url = `${API_URL}/api/booksongs/`;
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
        const b = {...book, year: 2000 }
        const url = `${API_URL}/api/book/`;
        const token = sessionStorage.getItem("token");
        const headers = { headers: {"Authorization": `Bearer ${token}`}, }
        return axios.post(url,b, headers).then(response => {
            console.log(response.data);
            alert("Success");}
         ).catch(e => {
            console.log(e, b);
            alert("An error occured");
        })

    }

    updateBook(book){
        const url = `${API_URL}/api/book/${book.book_id}/edit`;
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