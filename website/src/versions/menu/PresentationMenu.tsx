import { ZipTimeSlider } from '../ZipTimeSlider.tsx';
import { CSSProperties } from 'react';
import { TrackInformationModal } from '../trackInfo/TrackInformationModal.tsx';
import { LoadStateButton, showTimes } from '../store/LoadStateButton.tsx';
import { SurveyButton } from './SurveyButton.tsx';
import { TrackInformationModalButton } from '../trackInfo/TrackInformationModalButton.tsx';

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
    return (
        <>
            <TrackInformationModal />
            <div style={style} className={'shadow d-sm-block'}>
                <h5 className={'mt-2'}>Sternfahrt MUC 2024</h5>
                <ZipTimeSlider showPlayButton={true} bigThumb={true} showTimes={showTimes} />
                <LoadStateButton />
                <div>
                    <TrackInformationModalButton />
                    <SurveyButton />
                </div>
            </div>
            <div style={{ ...style, width: '95%' }} className={'shadow d-sm-none'}>
                <h5 className={'mt-2'}>Sternfahrt MUC 2024</h5>
                <ZipTimeSlider showPlayButton={true} bigThumb={true} showTimes={showTimes} />
                <LoadStateButton />
                <div>
                    <TrackInformationModalButton />
                    <SurveyButton />
                </div>
            </div>
        </>
    );
}
