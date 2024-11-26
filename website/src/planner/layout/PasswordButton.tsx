import { Button } from 'react-bootstrap';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import keyIcon from '../../assets/key.svg';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getIsPlanningAlreadySaved } from '../store/backend.reducer.ts';
import { UploadModalBody } from './UploadModalBody.tsx';

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
                className={'m-0 p-0'}
                variant="success"
                title={intl.formatMessage({ id: 'msg.password.hint' })}
                onClick={() => setShowModal(true)}
            >
                <img src={keyIcon} className="m-1" alt="password" style={{ height: '30px', width: '30px' }} />
                {intl.formatMessage({ id: 'msg.password' })}
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
