import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { getBaseUrl } from '../../../../utils/linkUtil.ts';
import { getEntryPointPositions } from '../../../logic/resolving/selectors/getEntryPointPositions.ts';
import { getPlanningId } from '../../../store/backend.reducer.ts';

interface PublicLinkProps {
    href: string;
    messageId: string;
}

const PublicLink = ({ href, messageId }: PublicLinkProps) => (
    <a href={href} target="_blank" rel="noreferrer" className="d-block mb-2">
        <FormattedMessage id={messageId} />
    </a>
);

export const PlannerSidebarOverviewPublicLinks = () => {
    const planningId = useSelector(getPlanningId);
    const entryPointPositions = useSelector(getEntryPointPositions);

    if (!planningId) {
        return <FormattedMessage id="msg.publicLinks.unsaved" />;
    }

    const baseUrl = getBaseUrl();
    const displayLink = `${baseUrl}?display=${planningId}`;
    const tableLink = `${baseUrl}?table=${planningId}`;

    return (
        <div>
            <PublicLink href={displayLink} messageId="msg.publicLink" />
            <PublicLink href={tableLink} messageId="msg.publicTableLink" />
            <PublicLink href={`${tableLink}&rows=0,1,2`} messageId="msg.publicTableLink.withIndex" />
            {entryPointPositions.length > 0 && (
                <>
                    <PublicLink href={`${displayLink}&times=defaultOn`} messageId="msg.publicLink.times.defaultOn" />
                    <PublicLink href={`${displayLink}&times=defaultOff`} messageId="msg.publicLink.times.defaultOff" />
                    <PublicLink href={`${displayLink}&times=off`} messageId="msg.publicLink.times.off" />
                </>
            )}
        </div>
    );
};
