import { Button } from 'react-bootstrap';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { CSSProperties, useState } from 'react';
import shareIcon from '../../assets/share.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getIsPlanningAlreadySaved, getPlanningId, getPlanningPassword } from '../store/backend.reducer.ts';
import { CopyToClipboardButton } from './CopyToClipboardButton.tsx';
import { getBaseUrl } from '../../utils/linkUtil.ts';

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
    const isPlanningAlreadySaved = useSelector(getIsPlanningAlreadySaved);
    const intl = useIntl();

    if (!isPlanningAlreadySaved) {
        return null;
    }

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
                    size={'xl'}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.sharingLink.modalTitle' })}
                    body={<SharingModalBody />}
                />
            )}
        </>
    );
}

const entryStyle = { display: 'flex', justifyContent: 'space-between', margin: '10px' };
const SharingModalBody = () => {
    const password = useSelector(getPlanningPassword);
    const planningId = useSelector(getPlanningId);
    const displayLink = `${getBaseUrl()}?display=${planningId}`;
    const planningLink = `${getBaseUrl()}?planning=${planningId}`;
    const planningLinkWithAdmin = `${getBaseUrl()}?planning=${planningId}&admin=${password}`;
    return (
        <div>
            <div style={entryStyle}>
                <span>
                    <FormattedMessage id={'msg.publicLink'} />: <b>{displayLink}</b>
                </span>
                <CopyToClipboardButton text={displayLink} />
            </div>
            <div style={entryStyle}>
                <span>
                    <FormattedMessage id={'msg.planningLink'} />: <b>{planningLink}</b>
                </span>
                <CopyToClipboardButton text={planningLink} />
            </div>
            {password && (
                <div style={entryStyle}>
                    <span>
                        <FormattedMessage id={'msg.planningLinkWithAdmin'} />: <b>{planningLinkWithAdmin}</b>
                    </span>
                    <CopyToClipboardButton text={planningLinkWithAdmin} />
                </div>
            )}
            {password && (
                <div style={entryStyle}>
                    <span>
                        <FormattedMessage id={'msg.planningPassword'} />: <b>{password}</b>
                    </span>
                    <CopyToClipboardButton text={password} />
                </div>
            )}
        </div>
    );
};
