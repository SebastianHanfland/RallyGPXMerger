import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { gpxSegmentsActions } from '../../store/gpxSegments.reducer.ts';
import { ConfirmationModal } from '../ConfirmationModal.tsx';
import { useState } from 'react';

interface Props {
    id: string;
    name: string;
}

export function ConstructionRemoveFileButton({ id, name }: Props) {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const removeConstruction = () => {
        dispatch(gpxSegmentsActions.removeConstructionSegment(id));
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
                    onConfirm={removeConstruction}
                    closeModal={() => setShowModal(false)}
                    title={'Removing Construction file'}
                    body={`Do you really want to remove the construction file "${name}"?`}
                />
            )}
        </>
    );
}
