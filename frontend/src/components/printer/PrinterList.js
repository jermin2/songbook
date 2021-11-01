import React, { useState, useEffect } from "react";
import PrinterService from "./PrinterService";

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import BookService from "../book/BookService";
import SongsService from "../song/SongsService";
import SongHelper from "../song/SongHelper";

const printerService = new PrinterService();
const songHelper = new SongHelper();

export const PrinterList = (data) => {
    const [list, setList] = useState();
    const [show, setShow] = useState(false);

    useEffect( () => {
        printerService.getAll().then(response => {
            // console.log(response)
            songHelper.addBookData(response).then( list => {
                setList(list);
            })

        })
    },[data])

    function showCreate(){
        console.log("show create")
        setShow(true);
    }

    function toggleModal() {
        setShow(!show);
    }

    return (
        <div>
            <div className="heading">
                <h2>Print A Book Editor</h2>
                <button className="btn btn-primary" onClick={showCreate}>Create New</button>
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name of Print</th>
                    <th scope="col">Based on book</th>
                </tr>
                </thead>
                <tbody>
                {list && list.map( s => {
                    return <tr key={s.id} onClick={()=>{data.history.push(`/printer/${s.id}`)}}>
                        <td>{s.id}</td>
                        <td>{s.name}</td>
                        <td>{s.book_title}</td>
                    </tr>
                })}
                </tbody>
                
            </table>
            <CreatePrint show={show} toggle={toggleModal} props={data} />
        </div>
    )
}

const bookService = new BookService();
const songService = new SongsService();

function CreatePrint( {show, toggle, props})  {

    const [books, setBooks] = useState();

    useEffect( () => {
        bookService.getBooks().then( response => {
            setBooks(response);
        })
    },[])

    async function getSongLyrics(id){
        const songObj = await songService.getSong(id)
        return songObj.lyrics
    }

    async function create(){
        console.log("hello");
        const name = document.getElementById('print-name').value
        const book = document.getElementById('print-book').value;

        const bookObj = await bookService.getBook(parseInt(book))
        console.log("bookobj", bookObj)
        var lyric_string = "";


        for (const bookSongObj of bookObj.songs) {
            const lyrics = await getSongLyrics(bookSongObj.song_id)
            lyric_string = lyric_string + `$${bookSongObj.index}\n${lyrics}\n\n`
        }


        console.log("lyrics", lyric_string);


        const print = {
            name: name,
            lyrics: lyric_string,
            style: "t",
            book_id: parseInt(book),

        }
        // console.log(props);

        printerService.create(print).then( response => {
            console.log(response)
            props.history.push(`/printer/${response.id}`)
        })
    }


    return (
        <Modal show={show}>
        <Modal.Header><Modal.Title>Create New Print</Modal.Title></Modal.Header>
        <Modal.Body>
        <Form.Control type="text" id="print-name" placeholder="Enter Name of Print (for your future reference)"/>
        <Form.Select id="print-book" aria-label="Default select book">
        <option value="-1">Choose book</option>
        {books && books.map( b => {
            return <option key={b.book_id} value={b.book_id}>{b.name}</option>
        })}
        </Form.Select>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={toggle}>Close</Button>
        <Button variant="primary" onClick={create}>Save</Button>
        </Modal.Footer>
        </Modal>
    )
}