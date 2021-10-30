import React,  {useState} from 'react'
import Renderer from '../song/Renderer'

const renderer = new Renderer();
export const BookPrinter = (data) => {

    const [lyrics, updateLyrics] = useState("");

    function render(stuff){
        return renderer.parseBook(stuff);
        return lyrics;
    }

    function handleChange(event){
        let { name, value } = event.target;
        updateLyrics(value);
    }

    return (
            <div className='printer-parent'>
                <div className="editor"><textarea onChange={handleChange} name="lyrics" value={lyrics}></textarea></div>
                <div className="viewer">{render(lyrics)}</div>
            </div>
    )
    
}