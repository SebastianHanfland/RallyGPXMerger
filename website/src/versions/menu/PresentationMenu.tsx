import { ZipTimeSlider } from '../ZipTimeSlider.tsx';
import { CSSProperties } from 'react';
import { TrackInformationModal } from '../trackInfo/TrackInformationModal.tsx';
import { LoadStateButton, showTimes } from '../store/LoadStateButton.tsx';
import { TrackInformationModalButton } from '../trackInfo/TrackInformationModalButton.tsx';
import { getPlanningTitle } from '../../planner/store/trackMerge.reducer.ts';
import { storedState } from '../data/loadJsonFile.ts';

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
    const title = (storedState && getPlanningTitle(storedState)) ?? 'Demonstration';
    return (
        <>
            <TrackInformationModal />
            <div style={style} className={'shadow d-sm-block'}>
                <h5 className={'mt-2'}>{title}</h5>
                <ZipTimeSlider showPlayButton={true} bigThumb={true} showTimes={showTimes} />
                <LoadStateButton />
                <div>
                    <TrackInformationModalButton />
                </div>
            </div>
            <div style={{ ...style, width: '95%' }} className={'shadow d-sm-none'}>
                <h5 className={'mt-2'}>{title}</h5>
                <ZipTimeSlider showPlayButton={true} bigThumb={true} showTimes={showTimes} />
                <LoadStateButton />
                <div>
                    <TrackInformationModalButton />
                </div>
            </div>
        </>
    );
}
