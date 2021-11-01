import BookWorker from './BookWorker'
import localforage from 'localforage';

const bookWorker = new BookWorker();

// use the books table
const booksTable = localforage.createInstance({
    name: "songbaseDB",
    storeName: "books"
});


const lang = "english";

export default class BookService {
    constructor(){
        if (BookService._instance) {
            return BookService._instance
          }
          BookService._instance = this;

          this.checkUpdate();
    }

    books = [];

    async checkUpdate(){
        const remoteStats = await bookWorker.getUpdate();

        const length = await booksTable.length().then( length => length);
        if(length !== remoteStats.books){
            console.log("updating books...!", length, remoteStats.books);
            bookWorker.fetchSongs().then( books => {
                //Get the list of songs from the database
                //Update the local copy
                this.books = books;
                books.forEach( b => {
                    booksTable.setItem(b.book_id.toString(), b);
                })
            })
        }

    }


    async getBooks() {
        console.log("get books called");
        //Check if we have it in memory
        if (this.books && this.books.length > 0) {
            return this.books;
        }
        //Check if we ahve it in local storage
        const length = await booksTable.length();

        if(length === 0){
            console.log("Fetch books - this shouldn't need to be called")
            bookWorker.fetchBooks().then( books => {
                
                for (const book of books) {
                    booksTable.setItem( book.book_id.toString(), book)
                }
                return books.filter( e=> e.lang === lang)
            })
        }

        // Iterate over local database (it should've synced)
        return await this.loadBooks();
    }

    getBook(id){

        return booksTable.getItem(id.toString()).then( result => result).catch(e => console.log(e) );
        // const url = `${API_URL}/api/book/${id}`;
        // return axios.get(url).then(response => response.data).catch(e => console.log(e));
    }

    async loadBooks(){
        const t_books = []
        return booksTable.iterate( (value,key,iterationNumber) => {
            t_books.push(value);
        }).then( () => {
            this.books = t_books;
            return this.books.filter( e=> e.lang === lang);
        })

    }

    deleteBook(id){
        bookWorker.deleteBook(id).then( response => {
            console.log(response);
            booksTable.removeItem(id);
            alert("Deleted!")
        }).catch( e => {
            console.log(e);
        })
    }

    createBook(book){
        const slug = book.name.replace(/\s/g, '_').toLowerCase();
        const b = {...book, slug: slug}

        bookWorker.createBook(b).then( response => {
            console.log(response);
            booksTable.setItem(response.book_id.toString(), response);
            alert("Success");
        }).catch(e => {
            console.log(e, b);
            alert("An error occured");
        })

    }

    updateBook(book){
        bookWorker.updateBook(book).then( response => {
            console.log(book);
            booksTable.setItem(book.book_id.toString(), book);
            alert("Success");}
         ).catch(e => {
            console.log(e);
            alert("An error occured");
        })
    }
}