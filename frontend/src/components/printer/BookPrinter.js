import React,  { useEffect, useState} from 'react'
import { PageRenderer } from '../song/PageRenderer'

import PrinterService from './PrinterService'

import './print.css';
import './print-editor.css';

const printerService = new PrinterService();

/**
 * A view for editing a print page to prepare for printing
 * @param {*} data 
 * @returns 
 */
export const BookPrinter = (data) => {

    const [lyrics, updateLyrics] = useState("");
    const [style, updateStyle] = useState("");
    const [styleSheet, setStyleSheet] = useState("")

    const [id, setId] = useState();


    useEffect( () => { 
        console.log(data);
        const { match: { params } } =  data;

        if(params && params.id){
            setId(params.id);
            printerService.get(params.id).then( response => {
                console.log(response)
                updateLyrics(response.lyrics);
                updateStyle(response.style);
                document.getElementById('style').value = response.style;
                document.getElementById('lyrics').value = response.lyrics;
                handleStyle();
                handleRender();
            })
        }
        // eslint-disable-next-line
    },[data])

    function handleSave(){
        const page = {
            lyrics: lyrics,
            style: style,
            id: id
        }
        console.log(page, id);
        if(id){
            console.log("i have an id")
            printerService.save(page, id)
        }else {
            printerService.create(page).then( response => {
                setId(response.id);
            });
        }
        
    }

    function handlePrint() {
        data.history.push(`/print/${id}`)
    }

    function handleStyle(){
        
        //Remove old style sheet if exist
        if(styleSheet.length !== 0 ){
            document.body.removeChild(styleSheet);
        }

        var sheet = document.createElement('style')
        sheet.innerHTML = document.getElementById('style').value;
        updateStyle(sheet.innerHTML)
        document.body.appendChild(sheet);
        console.log("inject css", sheet);
        setStyleSheet(sheet)

        handleRender()
    }

    function handleRender(){
        const lyrics = document.getElementById('lyrics').value;
        updateLyrics(lyrics);
    }

    return (
        
            <div className="parent">
                <div className="editorParent">
                    <textarea className="editorStyle" id="style" key="style"  name="style" placeholder="You can add CSS styling here 
The following options are available:
.page {}
.area {}
.song-number {}
.verse-number {}
.chord {}
.verse {}
.line {}
"></textarea>
                    <div className="buttonrow">
                        <button className="btn btn-warning" onClick={handleStyle}>Add Styling</button>
                        <button className="btn btn-primary" onClick={handleRender}>Render</button>
                        <button className="btn btn-success" onClick={handleSave}>Save</button>
                        <button className="btn btn-info" onClick={handlePrint}>Print</button>
                        
                    </div>
                    <textarea className="editorLyrics" id="lyrics" key="lyrics" name="lyrics" ></textarea>
                </div>
                <div className="viewerParent">
                    <div className="song-viewer">
                        <PageRenderer lyrics={lyrics} />
                    </div>
                </div>
            </div>
    )
}

