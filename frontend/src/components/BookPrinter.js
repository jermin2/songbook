import React,  {useState} from 'react'
import Parser from '../song/Parser'
import {createUseStyles} from 'react-jss'
import { PageRenderer } from '../song/PageRenderer'

import PrinterService from './PrinterService'

const printerService = new PrinterService();

const defaultStyle = {
    '@global' :{
        area: {
            color: 'red'
        }
    },
    area: {
        color: 'blue',
        height: '100%',
        background: 'red',
        margin: '50px'
    },
    parent: {
        display: 'flex'
    },
    editorParent: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column'
    },
    viewerParent: {
        width: '50%'
    },
    page: {
        width: '210mm',
        height: '297mm',
        border: '1px solid black',
        background: 'white',
        padding: '20mm'
    },
    viewer: {
        width: 'fit-content',
        height: '297mm',
        border: '2px solid black',
        padding: '20px',
        background: 'lightgrey',
        overflowY: 'scroll',

    },
    index: {
        color: 'red'
    }
}
var useStyles = createUseStyles(defaultStyle)


//210 x 297 mm
const renderer = new Parser();
export const BookPrinter = (data) => {

    const [lyrics, updateLyrics] = useState("");
    const [style, updateStyle] = useState("");
    const [udpatedStyle, setStyle] = useState("")

    function render(stuff){
        return renderer.parseBook(stuff, classes);
    }

    function handleChange(event){
        let { name, value } = event.target;
        updateLyrics(value);
    }

    function handleStyle(event){
        let { name, value } = event.target;
        updateStyle(value);
    }

    function handleSave(){
        const page = {
            text: lyrics,
            style: style,
        }
        // printerService.save(page).response( response => {
        //     console.log(response);
        // })
    }

    function handlePrint() {
        console.log("not yet implemented")
    }

    function handleClick(){
        
        // Do something convert to object
        const styleString = '{'+style+'}';
        const styleString_t = styleString.replace(/([\w|-]+)/g,'"$&"').replace(/\s+/g, ' ')
        console.log( styleString_t)
        const styleObject = JSON.parse(styleString_t)
        console.log(styleObject)
        console.log({...defaultStyle, ...styleObject})
        useStyles = createUseStyles({...defaultStyle, styleObject})
    }

    function handleTest(){
        const paper = document.getElementById('paper')
        if (paper.scrollHeight > paper.offsetHeight) {
            // is overflowing
            console.log("paper is overflowing")
          } else{
              console.log('paper is not overflowing')
          }
    }



    var classes = useStyles()
    return (
        
            <div className={classes.parent}>
                <div className={classes.index}>Index</div>
                <div className={classes.editorParent}>
                    <textarea onChange={handleStyle} name="style" value={style}></textarea>
                    <button onClick={handleClick}>Set Style Click me</button>
                    <button onClick={handleSave}>save</button>
                    <button onClick={handlePrint}>print</button>
                    <button onClick={handleTest}>Test</button>
                    <textarea onChange={handleChange} name="lyrics" value={lyrics}></textarea>
                </div>
                <div className={classes.viewerParent}>
                    <div className={classes.viewer}>
                        <PageRenderer lyrics={lyrics} classes={classes} />
                    </div>
                </div>
            </div>

            
    )
    
}