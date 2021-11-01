
import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function LoginModal(props) {
  // Declare a new state variable, which we'll call "count"
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(props.show);

  useEffect( () => {
    setShow(props.show);
  },[props.show]);

  function handleSave(){
    props.handleLogin(name, password);
  };

  return (

    <Modal show={show}>
    <Modal.Header><Modal.Title>Login</Modal.Title></Modal.Header>
    <Modal.Body>
    <Form id="newBook">
        <Form.Group className="mb-3" controlId="formBookName">
        <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter Name"/>
        </Form.Group>
    </Form>
    <Form id="password">
        <Form.Group className="mb-3" controlId="formBookPassword">
        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter Password"/>
        </Form.Group>
    </Form>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="secondary" onClick={ () => setShow(false)}>Close</Button>
    <Button variant="primary" type="submit" onClick={() => handleSave()} >Login</Button>
    </Modal.Footer>
    </Modal>
  );
}
