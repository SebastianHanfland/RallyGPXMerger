import { DisplayTimeSlider } from '../DisplayTimeSlider.tsx';
import { CSSProperties } from 'react';
import { TrackInformationModal } from '../trackInfo/TrackInformationModal.tsx';
import { TrackInformationModalButton } from '../trackInfo/TrackInformationModalButton.tsx';
import { useSelector } from 'react-redux';
import { getDisplayTitle } from '../store/displayTracksReducer.ts';

const style: CSSProperties = {
    paddingLeft: '15px',
    paddingRight: '15px',
    position: 'fixed',
    width: '350px',
    height: '160px',
    left: 0,
    right: 0,
    overflowY: 'scroll',
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'white',
    cursor: 'default',
    overflow: 'hidden',
    borderRadius: '10px',
    margin: '10px',
};

export function PresentationMenu() {
    const title = useSelector(getDisplayTitle) ?? 'Demonstration';
    return (
        <>
            <TrackInformationModal />
            <div style={style} className={'shadow d-sm-block'}>
                <h5 className={'mt-2'}>{title}</h5>
                <DisplayTimeSlider showPlayButton={true} bigThumb={true} />
                <div>
                    <TrackInformationModalButton />
                </div>
            </div>
            <div style={{ ...style, width: '95%' }} className={'shadow d-sm-none'}>
                <h5 className={'mt-2'}>{title}</h5>
                <DisplayTimeSlider showPlayButton={true} bigThumb={true} />
                <div>
                    <TrackInformationModalButton />
                </div>
            </div>
        </>
    );
}
