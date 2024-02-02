import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { getReplaceProcess, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import trash from '../../assets/trash.svg';

interface Props {
    id: string;
    name: string;
}

export function RemoveReplaceFileButton({ id, name }: Props) {
    const dispatch = useDispatch();
    const replacementProcess = useSelector(getReplaceProcess);
    const [showModal, setShowModal] = useState(false);
    const removeGpxSegment = () => {
        if (!replacementProcess) {
            return;
        }
        dispatch(
            gpxSegmentsActions.setReplaceProcess({
                ...replacementProcess,
                replacementSegments: replacementProcess.replacementSegments.filter((segment) => segment.id !== id),
            })
        );
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
                    title={'Removing file from replacement list'}
                    body={`Do you really want to remove the file "${name}" from the replacement list?`}
                />
            )}
        </>
    );
}
