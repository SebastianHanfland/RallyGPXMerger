import { DisplayTimeSlider } from '../DisplayTimeSlider.tsx';
import { CSSProperties } from 'react';
import { TrackInformationModal } from '../trackInfo/TrackInformationModal.tsx';
import { TrackInformationModalButton } from '../trackInfo/TrackInformationModalButton.tsx';
import { useSelector } from 'react-redux';
import { getDisplayEntryPoints, getDisplayTitle } from '../store/displayTracksReducer.ts';
import { TimeDisplayCheckbox } from '../trackInfo/TimeDisplayCheckbox.tsx';
import { useTimesConfig } from '../map/useTimesConfig.ts';

const style: CSSProperties = {
    paddingLeft: '15px',
    paddingRight: '15px',
    position: 'fixed',
    width: '350px',
    minHeight: '160px',
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

    const entryPointPositions = useSelector(getDisplayEntryPoints);
    const timesConfig = useTimesConfig();
    const doesNotShowTimes = entryPointPositions.length === 0 || timesConfig === 'off';
    const justifyContent = doesNotShowTimes ? 'center' : 'space-between';

    return (
        <>
            <TrackInformationModal />
            <div style={style} className={'shadow d-sm-block'}>
                <h5 className={'mt-2'}>{title}</h5>
                <DisplayTimeSlider showPlayButton={true} bigThumb={true} />
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: justifyContent }}>
                    <TrackInformationModalButton />
                    <TimeDisplayCheckbox />
                </div>
            </div>
            <div style={{ ...style, width: '95%' }} className={'shadow d-sm-none'}>
                <h5 className={'mt-2'}>{title}</h5>
                <DisplayTimeSlider showPlayButton={true} bigThumb={true} />
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: justifyContent }}>
                    <TrackInformationModalButton />
                    <TimeDisplayCheckbox />
                </div>
            </div>
        </>
    );
}
