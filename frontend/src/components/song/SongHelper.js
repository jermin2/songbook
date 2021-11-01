import SongsService from './SongsService';
import BookService from '../book/BookService';
const booksService = new BookService();
const songsService = new SongsService();

export default class SongHelper {
    constructor(){
        // if(SongHelper.books.length === 0) {
        //     booksService.getBooks().then( response => {
        //         SongHelper.books = response;
        //     })
        // }
    }
    static songs_sorted = []

    static books = []

    async getSortedSongList() {
        console.log("Get Sorted Song List", SongHelper.songs_sorted);
        if(SongHelper.songs_sorted.length===0){
            const songlist = await songsService.getSongs().then( result => {
                result = result.sort( (s1,s2) => {
                    if(s1.title > s2.title) return 1;
                    if(s2.title > s1.title) return -1;
                    return 0;
                });
                SongHelper.songs_sorted = result;
                return SongHelper.songs_sorted
            });
            SongHelper.songs_sorted = songlist;
            return songlist;

        } else {
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

                sorted_list = result;
                SongHelper.songs_sorted = sorted_list;
                
                const list = book_list.map( song => {
                    const s = sorted_list.find( e => e.song_id===song.song_id);
                    if(!s) console.log("this should not have happened", song);
                    return {...song, title: s.title, lyrics: s.lyrics};
                })

                
                return list;
                
            });

            return list;
        }
        else{
            //Songs have loaded
            console.log("songs have loaded", SongHelper.songs_sorted.length);
            return book_list.map( song => {
                const s = SongHelper.songs_sorted.find( e => e.song_id===song.song_id);
                if(!s) console.log("this should not have happened", song);
                return {...song, title: s.title, lyrics: s.lyrics};
            })
        }
    }

    // Add the book title to a given list that has book_id
    async addBookData(list){
        //Check we have book data
        var books;
        if(SongHelper.books.length===0){
            books = await booksService.getBooks();
        }

        //For each item on list, find the title for the matching book_id
        // and add the book_title key value to the object and return it
        const newlist = Promise.all(list.map( s => {
            if(!s.book_id) return s;
            const b = books.find( b => b.book_id === s.book_id);
            const ns = {...s, book_title: b.name };
            return ns;
        }))
        return newlist;
    }

    // Return list of songs which have an index in any book that matches the search term
    async filterByIndexes(searchIndex) {

        // Filter also by language
        const lang = "english"

        let books = await booksService.getBooks();

        const list = books.filter( b => b.lang === lang)

        var songlist = [];        
        for (const book of list){
            const s = book.songs.find( s => s.index === searchIndex)
            if(s) songlist.push(s); //add to array if its valid
        }

        let list_with_song_data = await this.addSongData(songlist)

        let list_with_book_data = await this.addBookData(list_with_song_data);

        return list_with_book_data;
        
    }

}