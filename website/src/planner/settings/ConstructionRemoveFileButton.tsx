import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import trash from '../../assets/trash.svg';
import { useIntl } from 'react-intl';
import { segmentDataActions } from '../new-store/segmentData.redux.ts';

interface Props {
    id: string;
    name: string;
}

export function ConstructionRemoveFileButton({ id, name }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const removeConstruction = () => {
        dispatch(segmentDataActions.removeConstructionSegment(id));
    };
    return (
        <>
            <Button
                variant="danger"
                title={intl.formatMessage({ id: 'msg.removeFile' })}
                onClick={() => setShowModal(true)}
            >
                <img src={trash} className="m-1" alt="trash" />
            </Button>
            {showModal && (
                <ConfirmationModal
                    onConfirm={removeConstruction}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.removeConstruction.modalTitle' })}
                    body={intl.formatMessage({ id: 'msg.removeConstruction.modalBody' }, { name })}
                />
            )}
        </>
    );
}
