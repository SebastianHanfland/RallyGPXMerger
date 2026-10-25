import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { getIsPlanningAlreadySaved, getPlanningId, getPlanningPassword } from '../store/backend.reducer.ts';
import { getIsShareModalOpen, layoutActions } from '../store/layout.reducer.ts';
import { getPlanningTitle } from '../store/settings.reducer.ts';
import { LinkAndClipboardCopy } from './LinkAndClipboardCopy.tsx';
import { getEntryPointPositions } from '../logic/resolving/selectors/getEntryPointPositions.ts';
import { getPlanningLinks } from './planningLinks.ts';

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
    const entryPointPositions = useSelector(getEntryPointPositions);
    const planningLinks = getPlanningLinks({
        planningId: planningId!,
        password,
        hasEntryPoints: entryPointPositions.length > 0,
    });
    const displayLink = planningLinks[0].href;
    const tableLink = planningLinks[1].href;
    const iframeExample = getIframeExample(displayLink, planningTitle);
    const iframeTableExample = getIframeExample(tableLink, planningTitle);

    return (
        <div>
            {planningLinks.map(({ messageId, href }) => (
                <LinkAndClipboardCopy key={messageId} messageId={messageId} link={href} />
            ))}
            <LinkAndClipboardCopy messageId={'msg.iframeExample'} link={iframeExample} openLink={false} />
            <LinkAndClipboardCopy messageId={'msg.iframeTableExample'} link={iframeTableExample} openLink={false} />
            {password && <LinkAndClipboardCopy messageId={'msg.planningPassword'} link={password} openLink={false} />}
        </div>
    );
};
