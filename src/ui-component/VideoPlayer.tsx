import React from 'react'
import ReactPlayer from 'react-player'
import { propsVideo } from '../interfaces/video';
import '../ui-component/VideoPlayer.css'
export function VideoPlayer(props: propsVideo){
    return (
        <ReactPlayer 
            id="idReactPlayer"
            controls={true}
            className='react-player'
            playing={true}
            volume={.8}
            onEnded={props.onEnded}
            url={props.url} 
        />
    );
}