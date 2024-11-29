import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import trash from '../../assets/trash.svg';
import { useIntl } from 'react-intl';
import { resetData } from '../io/resetData.ts';
import { useNavigate } from 'react-router';

export function CleanDataButton() {
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const intl = useIntl();

    const removeAllData = () => {
        resetData(dispatch);
        navigateTo('?section=menu');
        setShowModal(false);
    };
    return (
        <>
            <Button
                variant="danger"
                title={intl.formatMessage({ id: 'msg.removeAllData.hint' })}
                onClick={() => setShowModal(true)}
            >
                <img src={trash} className="m-1" alt="trash" style={{ height: '20px', width: '20px' }} />
                {intl.formatMessage({ id: 'msg.removeAllData' })}
            </Button>
            {showModal && (
                <ConfirmationModal
                    onConfirm={removeAllData}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.removeAllData.modalTitle' })}
                    body={intl.formatMessage({ id: 'msg.removeAllData.modalBody' })}
                />
            )}
        </>
    );
}
