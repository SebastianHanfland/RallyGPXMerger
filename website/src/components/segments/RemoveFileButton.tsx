import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { gpxSegmentsActions } from '../../planner/store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../../planner/store/trackMerge.reducer.ts';
import { ConfirmationModal } from '../ConfirmationModal.tsx';
import { useState } from 'react';

interface Props {
    id: string;
    name: string;
}

export function RemoveFileButton({ id, name }: Props) {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const removeGpxSegment = () => {
        dispatch(gpxSegmentsActions.removeGpxSegment(id));
        dispatch(trackMergeActions.removeGpxSegment(id));
    };
    return (
        <>
            <Button
                variant="danger"
                title={`Remove file "${name}" and all references`}
                onClick={() => setShowModal(true)}
            >
                x
            </Button>
            {showModal && (
                <ConfirmationModal
                    onConfirm={removeGpxSegment}
                    closeModal={() => setShowModal(false)}
                    title={'Removing Gpx Segment'}
                    body={`Do you really want to remove the file "${name}" and all its references?`}
                />
            )}
        </>
    );
}
