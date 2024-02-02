import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import trash from '../../assets/trash.svg';

interface Props {
    id: string;
    name: string;
}

export function RemoveReplaceFileButton({ id, name }: Props) {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const removeGpxSegment = () => {
        dispatch(gpxSegmentsActions.removeGpxSegment(id));
        dispatch(trackMergeActions.removeGpxSegment(id));
    };
    return (
        <>
            <Button
                variant={'danger'}
                title={`Remove file "${name}" from replacement list`}
                onClick={() => setShowModal(true)}
            >
                <img src={trash} className="m-1" alt="trash" />
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
