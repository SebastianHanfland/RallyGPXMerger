import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';
import { ConfirmationModal } from './ConfirmationModal.tsx';
import { useState } from 'react';

export function RemoveDataButton() {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const removeAllData = () => {
        dispatch(gpxSegmentsActions.clearGpxSegments());
        dispatch(trackMergeActions.clear());
        dispatch(calculatedTracksActions.removeCalculatedTracks());
        localStorage.clear();
    };
    return (
        <>
            <Button
                variant="danger"
                title="Delete all GPX segments, track compositions and tracks"
                onClick={() => setShowModal(true)}
            >
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
