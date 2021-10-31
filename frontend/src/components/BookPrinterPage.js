import React,  {useEffect, useState} from 'react'
import Parser from '../song/Parser'

import {render} from 'react-dom'
import {createUseStyles} from 'react-jss'

import PrinterService from './PrinterService'

import { PageRenderer } from '../song/PageRenderer'

const printerService = new PrinterService();
//210 x 297 mm
const renderer = new Parser();



const defaultStyle = {
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
}
var useStyles = createUseStyles(defaultStyle)


export const BookPrinterPage = (data) => {
    const [lyrics, setLyrics] = useState('');
    const [style, setStyle] = useState('');
    useEffect( () => {

        // Handle URL
        const { match: { params } } =  data;
        if(params && params.id) {
            console.log(params);

            //load the data
            printerService.getPrintPage(params.id).then( response => {
                console.log(response);
                console.log(response.lyrics);
                setLyrics(response.lyrics);
                setStyle(response.style);


            })
        }
    },[])



    var classes = useStyles()
    return (
            <PageRenderer lyrics={lyrics} classes={classes}/>
    )
    
}