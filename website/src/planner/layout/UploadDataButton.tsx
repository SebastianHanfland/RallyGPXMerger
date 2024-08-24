import { Button } from 'react-bootstrap';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { CSSProperties, useState } from 'react';
import fileUp from '../../assets/file-up.svg';
import { useIntl } from 'react-intl';

const removeDataStyle: CSSProperties = {
    position: 'fixed',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    left: 10,
    bottom: 170,
    zIndex: 10,
    overflow: 'hidden',
    cursor: 'pointer',
};

export function UploadDataButton() {
    const [showModal, setShowModal] = useState(false);
    const intl = useIntl();

    const uploadAllData = () => {
        // TODO: Upload current planning here
        setShowModal(false);
    };
    return (
        <>
            <Button
                style={removeDataStyle}
                className={'m-0 p-0'}
                variant="success"
                title={intl.formatMessage({ id: 'msg.removeAllData.hint' })}
                onClick={() => setShowModal(true)}
            >
                <img src={fileUp} className="m-1" alt="fileUp" style={{ height: '30px', width: '30px' }} />
            </Button>
            {showModal && (
                <ConfirmationModal
                    onConfirm={uploadAllData}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.uploadCurrentPlanning.modalTitle' })}
                    body={intl.formatMessage({ id: 'msg.uploadCurrentPlanning.modalBody' })}
                />
            )}
        </>
    );
}
