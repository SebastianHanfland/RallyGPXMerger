import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import trash from '../../assets/trash.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { resetData } from '../io/resetData.ts';

export function RemoveDataButton() {
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
                variant="danger"
                title={intl.formatMessage({ id: 'msg.removeAllData.hint' })}
                onClick={() => setShowModal(true)}
            >
                <img src={trash} className="m-1" alt="trash" />
                <FormattedMessage id={'msg.removeAllData'} />
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
