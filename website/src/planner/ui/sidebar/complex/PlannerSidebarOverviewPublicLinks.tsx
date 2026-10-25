import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { getEntryPointPositions } from '../../../logic/resolving/selectors/getEntryPointPositions.ts';
import { getPlanningId, getPlanningPassword } from '../../../store/backend.reducer.ts';
import { getPlanningLinks } from '../../../sharing/planningLinks.ts';

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
    const password = useSelector(getPlanningPassword);

    if (!planningId) {
        return <FormattedMessage id="msg.publicLinks.unsaved" />;
    }

    const planningLinks = getPlanningLinks({
        planningId,
        password,
        hasEntryPoints: entryPointPositions.length > 0,
    });

    return (
        <div>
            {planningLinks.map(({ messageId, href }) => (
                <PublicLink key={messageId} href={href} messageId={messageId} />
            ))}
        </div>
    );
};
