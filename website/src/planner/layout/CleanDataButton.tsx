import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import trash from '../../assets/trash.svg';
import { useIntl } from 'react-intl';
import { resetData } from '../io/resetData.ts';

export function CleanDataButton() {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const intl = useIntl();

    const removeAllData = () => {
        resetData(dispatch);
        setShowModal(false);
    };
    return (
        <>
            <Button
                className={'m-0 p-0'}
                variant="danger"
                title={intl.formatMessage({ id: 'msg.removeAllData.hint' })}
                onClick={() => setShowModal(true)}
            >
                <img src={trash} className="m-1" alt="trash" style={{ height: '30px', width: '30px' }} />
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
