import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { gpxSegmentsActions } from '../planner/store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../planner/store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../planner/store/calculatedTracks.reducer.ts';
import { ConfirmationModal } from './ConfirmationModal.tsx';
import { useState } from 'react';
import trash from '../assets/trash.svg';
import { mapActions } from '../planner/store/map.reducer.ts';
import { clearReadableTracks } from '../logic/MergeCalculation.ts';
import { geoCodingActions } from '../planner/store/geoCoding.reducer.ts';

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
