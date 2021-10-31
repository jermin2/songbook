import SongsService from './SongsService';
import BookService from '../book/BookService';
const booksService = new BookService();
const songsService = new SongsService();

export default class SongHelper {
    constructor(){
        
        // this.getSortedSongList();
        if(SongHelper.booksongs.length ===0 ){
            booksService.getBookSongs().then( response => {
                SongHelper.booksongs = response;
            })
        }
        // if(SongHelper.books.length === 0) {
        //     booksService.getBooks().then( response => {
        //         SongHelper.books = response;
        //     })
        // }
    }
    static songs_sorted = []
    static booksongs = []
    static books = []

    async getSortedSongList() {
        console.log("Get Sorted Song List", SongHelper.songs_sorted);
        if(SongHelper.songs_sorted.length===0){
            console.log("songs_sorted length is 0");
            const songlist = await songsService.getSongs().then( result => {
                console.log("result", result)
                result = result.sort( (s1,s2) => {
                    if(s1.title > s2.title) return 1;
                    if(s2.title > s1.title) return -1;
                    return 0;
                });
                SongHelper.songs_sorted = result;
                console.log("got sorted list", SongHelper.songs_sorted);
                return SongHelper.songs_sorted
            });
            SongHelper.songs_sorted = songlist;
            return songlist;

        } else {
            console.log("foudn stuff in local database");
            return SongHelper.songs_sorted;
        }
    }
    // const myPromise = new Promise((resolve, reject) => {
    //     resolve(SongsService.songs)
    //   });


    // Adds title, text to a given list with song_id
    async addSongData(book_list){
        // map the (song_id) field with the sorted list of songs

        // Check to see if the songs have been loaded yet, if not
        if(SongHelper.songs_sorted.length===0 ){
        console.log("songs not ready yet", SongHelper.songs_sorted.length);
        
            let sorted_list = [];
            // load them
            const list = await this.getSortedSongList().then( result => {
                console.log("sorted", result);
                sorted_list = result;
                SongHelper.songs_sorted = sorted_list;
                
                const list = book_list.map( song => {
                    const s = sorted_list.find( e => e.song_id===song.song_id);
                    if(!s) console.log("this should not have happened", song);
                    return {...song, title: s.title, lyrics: s.lyrics};
                })
                console.log("loaded list", list);
                
                return list;
                
            });
            console.log("addSongData", list);
            return list;
        }
        else{
            //Songs have loaded
            console.log("songs have laoded", SongHelper.songs_sorted);
            return book_list.map( song => {
                const s = SongHelper.songs_sorted.find( e => e.song_id===song.song_id);
                if(!s) console.log("this should not have happened", song);
                return {...song, title: s.title, lyrics: s.lyrics};
            })
        }
    }

    // Add the book title to a given list that has book_id
    addBookData(list){
        const newlist = list.map( s => {
            const b = SongHelper.books.find( b => b.book_id === s.book_id);
            const ns = {...s, book_title: b.name };
            return ns;
        })
        return newlist;
    }

    filterByIndex(searchIndex, song){

        const r = SongHelper.booksongs.some( e => e.song_id === song.id && e.index === searchIndex);
        if(r){
            // const bookname = bookService.getBook
            return [r, "yay"]
        }
        return [r, ""]
    }

    async filterByIndexes(searchIndex) {

        // Filter also by language
        const lang = "english"

        let books = await booksService.getBooks();
        SongHelper.books = books;

        const lang_list = SongHelper.books.filter( b => b.lang === lang)

        const list = SongHelper.booksongs.filter( e => {
            return (e.index === searchIndex) && (lang_list.some( k => k.book_id === e.book_id) )
        });

        let list_with_song_data = await this.addSongData(list)

        let list_with_book_data = await this.addBookData(list_with_song_data);

        return list_with_book_data;
        
    }

}