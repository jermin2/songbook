import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

import SongDisplay from './SongDisplay'

import SongService from './SongsService'

const songService = new SongService();

const divStyle = {
    display: 'flex',
    justifyContent:'space-between'
  };

class SongEdit extends Component {
    constructor(props){
        super(props);
        this.state  = {
            song: {
                id: -1,
                title: "",
                text: ""
            }
        }
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount(){
        const  { match: {params} }  = this.props;

        if( this.props.match.path === '/song/new'){

            this.setState({
                mode: 'NEW_SONG',
                song: {
                    id: -1,
                    title: "Title here",
                    text: "text here"
                }
            })
        }
        else
        if(params && params.id) {
            songService.getSong(params.id).then( result => {
                this.setState({
                    song: result
                });
            })
        }
    }


    handleChange = (event) => {

        let { name, value } = event.target;
        const activeSong = {...this.state.song, [name]: value };
        this.setState({
            song:activeSong
        })
 
    }

    handleSave() {
        if(this.state.song.id === -1){
            songService.createSong(this.state.song);
        } else {
            songService.updateSong(this.state.song);
        }
    }

    handleDelete(){
        var r = window.confirm("This will delete the song permanently - this cannot be reversed!");
        if(r){
            songService.deleteSong(this.state.song.id);
            this.props.history.push("/");
        }
    }

    render() {
        return (
            <div className="edit-song-parent widescreen-parent">
                <div className="edit-song-form widescreen">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control type="text" name="title" placeholder="Title" value={this.state.song.title} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control className="edit-song-textarea" as="textarea" name="text" value={this.state.song.text} onChange={this.handleChange}/>
                    </Form.Group>
                    <div style={divStyle}>
                    <Button className="btn-danger" onClick={() => this.handleDelete()}>Delete</Button>
                    <Button onClick={this.handleSave}>Save</Button>
                    </div>
                </Form>
                </div>
                <div className="edit-song-display widescreen">
                    < SongDisplay mode="BY_SONG" id={this.state.song.id} song={this.state.song}/>
                </div>
            </div>
            

        )
    }
}

export default SongEdit