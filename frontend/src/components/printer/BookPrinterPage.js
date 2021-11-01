import React,  {useEffect, useState} from 'react'

import PrinterService from './PrinterService'

import { PageRenderer } from '../song/PageRenderer'

import './print.css';

const printerService = new PrinterService();
/**
 * A wrapper class that loads the book from the database and calls the PageRender
 * @param {} data 
 * @returns 
 */
export const BookPrinterPage = (data) => {
    const [lyrics, setLyrics] = useState('');
    useEffect( () => {

        // Handle URL
        const { match: { params } } =  data;
        if(params && params.id) {

            //load the data
            printerService.get(params.id).then( response => {
                setLyrics(response.lyrics);

                var hideGUISheet = document.createElement('style')
                hideGUISheet.innerHTML = ".title {display:none;}  .sideNav{display: none}"
                document.body.appendChild(hideGUISheet);

                //load the styles
                var sheet = document.createElement('style')
                sheet.innerHTML = response.style
                document.body.appendChild(sheet);
            })
        }
    // eslint-disable-next-line
    },[])

    return (
            <PageRenderer lyrics={lyrics} />
    )
    
}