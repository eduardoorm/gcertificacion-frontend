import ReactPlayer, {ReactPlayerProps} from 'react-player';

export interface propsVideo extends ReactPlayerProps {
    url: string,
    onEnded?(): void
}

