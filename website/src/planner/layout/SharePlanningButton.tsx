import { Button } from 'react-bootstrap';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { CSSProperties, useState } from 'react';
import shareIcon from '../../assets/share.svg';
import { useIntl } from 'react-intl';

const sharePlanningStyle: CSSProperties = {
    position: 'fixed',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    left: 10,
    bottom: 230,
    zIndex: 10,
    overflow: 'hidden',
    cursor: 'pointer',
};

export function SharePlanningButton() {
    const [showModal, setShowModal] = useState(false);
    const intl = useIntl();

    const uploadAllData = () => {
        // TODO: Upload current planning here
        setShowModal(false);
    };
    return (
        <>
            <Button
                style={sharePlanningStyle}
                className={'m-0 p-0'}
                variant="info"
                title={intl.formatMessage({ id: 'msg.sharingLink.hint' })}
                onClick={() => setShowModal(true)}
            >
                <img src={shareIcon} className="m-1" alt="fileUp" style={{ height: '30px', width: '30px' }} />
            </Button>
            {showModal && (
                <ConfirmationModal
                    onConfirm={uploadAllData}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.sharingLink.modalTitle' })}
                    body={intl.formatMessage({ id: 'msg.sharingLink.modalBody' })}
                />
            )}
        </>
    );
}
