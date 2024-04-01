import { ZipTimeSlider } from '../ZipTimeSlider.tsx';
import { CSSProperties } from 'react';
import { TrackInformationModal } from '../trackInfo/TrackInformationModal.tsx';
import { LoadStateButton } from '../store/LoadStateButton.tsx';

const style: CSSProperties = {
    paddingLeft: '15px',
    position: 'fixed',
    width: '250px',
    height: '160px',
    left: 0,
    right: 0,
    overflowY: 'scroll',
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'white',
    cursor: 'default',
    overflow: 'hidden',
};

export function PresentationMenu() {
    return (
        <div style={style} className={'shadow'}>
            <h5 className={'mt-2'}>Sternfahrt Muc 2024</h5>
            <ZipTimeSlider />
            <LoadStateButton />
            <div>
                <TrackInformationModal />
            </div>
        </div>
    );
}
