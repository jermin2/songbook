import SongsService from './SongsService';
import BookService from '../book/BookService';
const booksService = new BookService();
const songsService = new SongsService();

export default class SongHelper {
    constructor(){
        this.getSortedSongList();
        if(this.booksongs.length ===0 ){
            booksService.getBookSongs().then( response => {
                this.booksongs = response;
            })
        }
        if(this.books.length === 0) {
            booksService.getBooks().then( response => {
                this.books = response;
            })
        }
    }
    songs_sorted = []
    booksongs = []
    books = []

    getSortedSongList() {
        // console.log(this.songs_sorted);
        if(this.songs_sorted.length===0){
            songsService.getSongs().then( result => {
                result = result.sort( (s1,s2) => {
                    if(s1.title > s2.title) return 1;
                    if(s2.title > s1.title) return -1;
                    return 0;
                });
            this.songs_sorted = result;
            // console.log("got sorted list", this.songs_sorted);
            });

        } else {
            return this.songs_sorted;
        }
    }

    // Adds title, text to a given list with song_id
    addSongData(book_list){
        // console.log("addSongData", this.songs_sorted);
        // map the (song_id) field with the sorted list of songs
        return book_list.map( song => {
            const s = this.songs_sorted.find( e => e.song_id===song.song_id);
            return {...song, title: s.title, text: s.text};
        })
    }

    // Add the book title to a given list that has book_id
    addBookData(list){
        const newlist = list.map( s => {
            const b = this.books.find( b => b.book_id === s.book_id);
            const ns = {...s, book_title: b.title };
            return ns;
        })
        return newlist;
    }

    filterByIndex(searchIndex, song){

        const r = this.booksongs.some( e => e.song_id === song.id && e.index === searchIndex);
        if(r){
            // const bookname = bookService.getBook
            return [r, "yay"]
        }
        return [r, ""]
    }

    filterByIndexes(searchIndex) {
        const list = this.booksongs.filter( e => e.index === searchIndex);
        console.log(list);
        const w = this.addSongData(list)

        const q = this.addBookData(w);
        return q;
    }

}