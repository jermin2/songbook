import { useState, useCallback, useEffect } from 'react';
import { Card } from './SongItem';
import update from 'immutability-helper';
const style = {
    width: 400,
};
export const Bucket = (data) => {
    
        // const cardState = data.songs;
        const [cards, setCards] = useState([]);
        const [base_cards, setBaseCards] = useState([]);

        // On Update
        useEffect(() => {
            // Update the document title using the browser API

            // If the state (cards) is empty, read in the new list (from parent)
            // OR the new songlist differs from the base
            // Base_cards is so we don't track changes happening in cards
            if(cards.length === 0 || data.songs.length !== base_cards.length){
                setCards(data.songs);
                setBaseCards(data.songs);
                
            } // don't need to update if it is the same
            else if(base_cards.length === data.songs.length){}
         // eslint-disable-next-line   
          },[data.songs.length] );

          useEffect( () => {
            data.updateList(cards);
          },[base_cards])

          // only update if cards change (due to order changing)
          useEffect( ()=> {
              var ind = 0;
              cards.forEach( card => {
                card.index = ind;
                ind++;
              })

          // eslint-disable-next-line
          }, [cards])

          //Only want to update when item is dropped
        const callUpdateOnDrop = useCallback( () => {
            data.updateList(cards);
        }, [cards]);

        const moveCard = useCallback((dragIndex, hoverIndex) => {
            const dragCard = cards[dragIndex];
            setCards(update(cards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            }));
        }, [cards]);
        const renderCard = (card, index) => {
            
            return (<Card key={card.song_id} index={index} id={card.song_id} text={card.title} moveCard={moveCard} update={callUpdateOnDrop}/>);
        };
        return (<>
				<div key="a" style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
			</>);
    
};
