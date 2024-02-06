import React from 'react'
import ReactPlayer from 'react-player'
import { propsVideo } from '../interfaces/video';

export function VideoPlayer(props: propsVideo){
    return (
        <ReactPlayer 
            controls={true}
            className='react-player'
            playing={true}
            volume={.8}
            onEnded={props.onEnded}
            url={props.url} 
        />
    );
}