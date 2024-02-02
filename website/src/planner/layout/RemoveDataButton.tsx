import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import trash from '../../assets/trash.svg';
import { mapActions } from '../store/map.reducer.ts';
import { geoCodingActions } from '../store/geoCoding.reducer.ts';
import { clearReadableTracks } from '../cache/readableTracks.ts';
import { layoutActions } from '../store/layout.reducer.ts';

export function RemoveDataButton() {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const removeAllData = () => {
        clearReadableTracks();
        dispatch(gpxSegmentsActions.clearGpxSegments());
        dispatch(trackMergeActions.clear());
        dispatch(calculatedTracksActions.removeCalculatedTracks());
        dispatch(mapActions.setShowGpxSegments(true));
        dispatch(mapActions.setShowBlockStreets(false));
        dispatch(mapActions.setShowCalculatedTracks(false));
        dispatch(geoCodingActions.clear());
        dispatch(layoutActions.selectSection('start'));
        localStorage.clear();
        setShowModal(false);
    };
    return (
        <>
            <Button
                variant="danger"
                title="Delete all GPX segments, track compositions and tracks"
                onClick={() => setShowModal(true)}
            >
                <img src={trash} className="m-1" alt="trash" />
                Remove all data
            </Button>
            {showModal && (
                <ConfirmationModal
                    onConfirm={removeAllData}
                    closeModal={() => setShowModal(false)}
                    title={'Deleting all data'}
                    body={'Do you really want to remove all data?'}
                />
            )}
        </>
    );
}
