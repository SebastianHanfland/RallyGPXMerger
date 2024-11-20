import { Button } from 'react-bootstrap';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { CSSProperties, useState } from 'react';
import keyIcon from '../../assets/key.svg';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getIsPlanningAlreadySaved } from '../store/backend.reducer.ts';
import { UploadModalBody } from './UploadModalBody.tsx';

const passwordStyle: CSSProperties = {
    position: 'fixed',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    left: 10,
    bottom: 290,
    zIndex: 10,
    overflow: 'hidden',
    cursor: 'pointer',
};

export function PasswordButton() {
    const [showModal, setShowModal] = useState(false);
    const isPlanningAlreadySaved = useSelector(getIsPlanningAlreadySaved);
    const intl = useIntl();

    if (!isPlanningAlreadySaved) {
        return null;
    }

    return (
        <>
            <Button
                style={passwordStyle}
                className={'m-0 p-0'}
                variant="success"
                title={intl.formatMessage({ id: 'msg.password.hint' })}
                onClick={() => setShowModal(true)}
            >
                <img src={keyIcon} className="m-1" alt="password" style={{ height: '30px', width: '30px' }} />
            </Button>
            {showModal && (
                <ConfirmationModal
                    size={'xl'}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.password.modalTitle' })}
                    body={<UploadModalBody text={''} />}
                />
            )}
        </>
    );
}
