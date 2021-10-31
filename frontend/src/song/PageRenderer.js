
import { renderToStaticMarkup } from "react-dom/server"
import React, {useEffect, useState} from 'react'
import Parser from './Parser'

const parser = new Parser();
const MAX_COLUMNS = 1;

/*
Renders a book suitable for printing
Currently on SONG_BLOCK mode, so it will keep songs together and avoid breaking them
*/
export const PageRenderer = (data) => {
    const [lyrics, setLyrics] = useState(data.lyrics)
    const [classes, ] = useState(data.classes);
    const [currentPage, setPage] = useState(1);
    const [currentArea, setArea] = useState(1);
    
    // New data - Wipe the slate clean
    useEffect( () => {
        document.getElementById('viewer-parent').innerHTML = ""
        getNewPage(0)
        getNewArea(0,1);
        setLyrics(data.lyrics)
    
    // eslint-disable-next-line
    },[data]);


    // The Guts. Split the book into song_blocks.
    // Write the block into the Area. If it overflows, undo the actions, 
    // Create a new area, and write it into there
    useEffect( () => {
        
        // Break on song blocks. Keep song blocks together
        const song_blocks = lyrics.split('$');

        let curPageId = 1
        let curAreaId = 1

        // For each block
        song_blocks.forEach( block => {
            console.log("writing to: ", curPageId, curAreaId);

            // Get the area to write to
            const area = document.getElementById(`page-${curPageId}-area-${curAreaId}`);

            // Create the line element
            const blockObj = createBlock(block);

            // append the line element
            area.append(blockObj);

            // check for overflow
            if (area.scrollHeight > area.offsetHeight){
                console.log("overflow")

                //Remove the overflowing object
                area.removeChild(blockObj);

                // Get a new area
                var [e, curAreaId_t, curPageId_t] = getNewArea(curAreaId, curPageId)
                curAreaId = curAreaId_t;
                curPageId = curPageId_t;

                // Add the overflow object to new area
                e.append(blockObj);
            }
        })
    // eslint-disable-next-line    
    },[lyrics])

    /**
     * @param {String} HTML representing a single element
     * @return {Element}
     */
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    /**
     * Converts song_block text into DOM element. Calls the respective function in Parser
     * @param {String} song_block String containing data for a song. 
     * @returns a DOM element representing the song
     */
    function createBlock(song_block){
        const b = parser.parseSongBlock(song_block)
        // turn React to markup
        const staticElement = renderToStaticMarkup(b)
        // convert from HTML to element
        const block = htmlToElement(staticElement);
        return block;
    }

    /**
     * Returns a new DOM page element. Updates the current ID to match the new element
     * @param {Integer} page_id the current page id.
     * @returns [element, id] where element is the new page element. ID is the updated current ID
     */
    function getNewPage(page_id = currentPage) {
        console.log("create new page");
        const e = document.createElement('div');

        const cur_page_id = page_id+1;
        e.setAttribute('id', `page-${cur_page_id}`)

        e.setAttribute('class', classes.page)

        //Add new page to the viewer
        document.getElementById('viewer-parent').append(e);

        setPage(cur_page_id);
        return [e, cur_page_id];
    }

    /**
     * Creates a new DOM 'Area' element.
     * Compares current Area ID with MAX_COLUMNS to determine if it should call getNewPage().
     * @param {Integer} area_id The current Area ID
     * @param {Integer} page_id The current Page ID
     * @returns [e, area_id, page_id], where:
     *  e is the new Area element, 
     *  area_id is the updated Area ID matching the new element
     *  page_id is the updated Page ID (updates when getNewPage is called)
     */
    function getNewArea(area_id = currentArea, page_id = currentPage){
        console.log("create new area");

        var curPage = page_id;

        //Update the area id for the new area
        var curArea = area_id + 1;

        // Check if we have reached max columns. If so, create another column. Update page_id if necessary
        if(curArea > MAX_COLUMNS){
            const [ , curPage_t] = getNewPage(page_id);
            curPage = curPage_t
            curArea = 1;
        }

        //Create the new area for the current area id and page id
        const e = document.createElement('div')
        e.setAttribute('id', `page-${curPage}-area-${curArea}`)
        e.setAttribute('class', classes.area)

        // this can probably be deleted
        setArea(curArea);
        
        // append to current page
        document.getElementById(`page-${curPage}`).append(e);
        return [e, curArea, curPage]
    }

    return (
        <div id="viewer-parent">
            <div id={`page-1`} className={classes.page}>
                <div id="page-1-area-1" className={classes.area}>
                {lyrics}
                </div>
            </div>
        </div>
    )

}