import React, { Component } from 'react';

import SongsService from './SongsService';

const songsService = new SongsService();

class SongDisplay extends Component {
    constructor(props){
        super(props);
        this.state = {
            song: {
                title: "",
                text: ""
            }
        }
    }

    componentDidMount(){
        const { match: { params } } =  this.props;

        if (params && params.id){
            var self = this;
            songsService.getSong(params.id).then(function (result) {
                self.setState({
                    song: result
                })

            })
        }
    }

    render() {
        return(
        <div>
            <div>{this.state.song.text}</div>
        </div>
        )
    }


}

export default SongDisplay;