
import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import BookService from './book/BookService';
const bookService = new BookService();

export default function NewBookModal(props) {
  // Declare a new state variable, which we'll call "count"
  const [name, setTitle] = useState("");
  const [show, setShow] = useState(props.show);

  useEffect( () => {
    setShow(props.show);
  },[props.show]);

  function handleSave(){
      bookService.createBook({name: name});
      props.toggleShow();
  };

  return (

    <Modal show={show}>
    <Modal.Header><Modal.Title>Add New Book</Modal.Title></Modal.Header>
    <Modal.Body>
    <Form id="newBook">
        <Form.Group className="mb-3" controlId="formBookTitle">
        <Form.Control type="text" value={name} onChange={e => setTitle(e.target.value)} placeholder="Enter Title"/>
        </Form.Group>
    </Form>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="secondary" onClick={ () => props.toggleShow()}>Close</Button>
    <Button variant="primary" type="submit" onClick={() => handleSave()} >Save</Button>
    </Modal.Footer>
    </Modal>
  );
}
