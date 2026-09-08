import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { getIsPlanningAlreadySaved, getPlanningId, getPlanningPassword } from '../store/backend.reducer.ts';
import { getIsShareModalOpen, layoutActions } from '../store/layout.reducer.ts';
import { getBaseUrl } from '../../utils/linkUtil.ts';
import { getPlanningTitle } from '../store/settings.reducer.ts';
import { EntryPointOptions } from './EntryPointOptions.tsx';
import { LinkAndClipboardCopy } from './LinkAndClipboardCopy.tsx';

export function SharePlanningModal() {
    const isShareModalOpen = useSelector(getIsShareModalOpen);
    const isPlanningAlreadySaved = useSelector(getIsPlanningAlreadySaved);
    const dispatch = useDispatch();
    const intl = useIntl();

    if (!isShareModalOpen || !isPlanningAlreadySaved) {
        return null;
    }

    return (
        <ConfirmationModal
            size={'xl'}
            closeModal={() => dispatch(layoutActions.setIsShareModalOpen(false))}
            title={intl.formatMessage({ id: 'msg.sharingLink.modalTitle' })}
            body={<SharingModalBody />}
        />
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
            <LinkAndClipboardCopy messageId={'msg.publicTableLink.withIndex'} link={tableLink + '&rows=0,1,2'} />
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
