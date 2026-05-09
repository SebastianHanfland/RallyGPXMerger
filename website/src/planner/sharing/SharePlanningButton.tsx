import { Button } from 'react-bootstrap';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { CSSProperties, useState } from 'react';
import shareIcon from '../../assets/share.svg';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getIsPlanningAlreadySaved, getPlanningId, getPlanningPassword } from '../store/backend.reducer.ts';
import { getBaseUrl } from '../../utils/linkUtil.ts';
import { getPlanningTitle } from '../store/settings.reducer.ts';
import { EntryPointOptions } from './EntryPointOptions.tsx';
import { LinkAndClipboardCopy } from './LinkAndClipboardCopy.tsx';

const sharePlanningStyle1: CSSProperties = {
    position: 'fixed',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    left: 10,
    bottom: 60,
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

    const buttonSize = onMap ? '30px' : '20px';
    return (
        <>
            <Button
                style={onMap ? sharePlanningStyle1 : undefined}
                className={onMap ? 'm-0 p-0' : undefined}
                variant="info"
                title={intl.formatMessage({ id: 'msg.sharingLink.hint' })}
                onClick={() => setShowModal(true)}
            >
                <img src={shareIcon} className="m-1" alt="fileUp" style={{ height: buttonSize, width: buttonSize }} />
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
    const compareLink = `${getBaseUrl()}?comparison=${planningId},<other-planning-id>`;
    const displayLink = `${getBaseUrl()}?display=${planningId}`;
    const tableLink = `${getBaseUrl()}?table=${planningId}`;
    const planningLink = `${getBaseUrl()}?section=gps&planning=${planningId}`;
    const planningLinkWithAdmin = `${getBaseUrl()}?section=gps&planning=${planningId}&admin=${password}`;
    const iframeExample = getIframeExample(displayLink, planningTitle);
    const iframeTableExample = getIframeExample(tableLink, planningTitle);

    return (
        <div>
            <LinkAndClipboardCopy messageId={'msg.publicLink'} link={displayLink} />
            <LinkAndClipboardCopy messageId={'msg.publicTableLink'} link={tableLink} />
            <LinkAndClipboardCopy messageId={'msg.planningLink'} link={planningLink} />
            <LinkAndClipboardCopy messageId={'msg.compareLink'} link={compareLink} />
            <LinkAndClipboardCopy messageId={'msg.iframeExample'} link={iframeExample} />
            <LinkAndClipboardCopy messageId={'msg.iframeTableExample'} link={iframeTableExample} />

            {password && <LinkAndClipboardCopy messageId={'msg.planningLinkWithAdmin'} link={planningLinkWithAdmin} />}
            {password && <LinkAndClipboardCopy messageId={'msg.planningPassword'} link={password} />}

            <EntryPointOptions />
        </div>
    );
};
