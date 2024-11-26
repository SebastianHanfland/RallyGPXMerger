import { Button } from 'react-bootstrap';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { CSSProperties, useState } from 'react';
import shareIcon from '../../assets/share.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getIsPlanningAlreadySaved, getPlanningId, getPlanningPassword } from '../store/backend.reducer.ts';
import { CopyToClipboardButton } from './CopyToClipboardButton.tsx';
import { getBaseUrl } from '../../utils/linkUtil.ts';
import { getPlanningTitle } from '../store/trackMerge.reducer.ts';

const sharePlanningStyle1: CSSProperties = {
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

export function SharePlanningButton({ onMap }: { onMap?: boolean }) {
    const [showModal, setShowModal] = useState(false);
    const isPlanningAlreadySaved = useSelector(getIsPlanningAlreadySaved);
    const intl = useIntl();

    if (!isPlanningAlreadySaved) {
        return null;
    }

    return (
        <>
            <Button
                style={onMap ? sharePlanningStyle1 : undefined}
                className={'m-0 p-0'}
                variant="info"
                title={intl.formatMessage({ id: 'msg.sharingLink.hint' })}
                onClick={() => setShowModal(true)}
            >
                <img src={shareIcon} className="m-1" alt="fileUp" style={{ height: '30px', width: '30px' }} />
                {!onMap && intl.formatMessage({ id: 'msg.sharingLink.hint' })}
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

function getIframeExample(displayLink: string, planningTitle: string | undefined) {
    const iframeExample = `
        <iframe
            src='${displayLink}'
            title='${planningTitle ?? 'Demonstration'}'
            height='1000px'
            width='1000px'
        ></iframe>
    `;
    return iframeExample;
}

const SharingModalBody = () => {
    const password = useSelector(getPlanningPassword);
    const planningId = useSelector(getPlanningId);
    const planningTitle = useSelector(getPlanningTitle);
    const displayLink = `${getBaseUrl()}?display=${planningId}`;
    const tableLink = `${getBaseUrl()}?table=${planningId}`;
    const planningLink = `${getBaseUrl()}?planning=${planningId}`;
    const planningLinkWithAdmin = `${getBaseUrl()}?planning=${planningId}&admin=${password}`;
    const iframeExample = getIframeExample(displayLink, planningTitle);
    const iframeTableExample = getIframeExample(tableLink, planningTitle);
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
                    <FormattedMessage id={'msg.publicTableLink'} />: <b>{tableLink}</b>
                </span>
                <CopyToClipboardButton text={tableLink} />
            </div>
            <div style={entryStyle}>
                <span>
                    <FormattedMessage id={'msg.planningLink'} />: <b>{planningLink}</b>
                </span>
                <CopyToClipboardButton text={planningLink} />
            </div>
            <div style={entryStyle}>
                <span>
                    <FormattedMessage id={'msg.iframeExample'} />: <b>{iframeExample}</b>
                </span>
                <CopyToClipboardButton text={iframeExample} />
            </div>
            <div style={entryStyle}>
                <span>
                    <FormattedMessage id={'msg.iframeTableExample'} />: <b>{iframeTableExample}</b>
                </span>
                <CopyToClipboardButton text={iframeTableExample} />
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
