import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { getPlanningId } from '../store/backend.reducer.ts';
import { getBaseUrl } from '../../utils/linkUtil.ts';
import { getEntryPointPositions } from '../logic/resolving/selectors/getEntryPointPositions.ts';
import { LinkAndClipboardCopy } from './LinkAndClipboardCopy.tsx';

export const EntryPointOptions = () => {
    const planningId = useSelector(getPlanningId);
    const displayLink = `${getBaseUrl()}?display=${planningId}`;

    const entryPointPositions = useSelector(getEntryPointPositions);

    const hasEntryPoints = entryPointPositions.length > 0;
    if (!hasEntryPoints) {
        return null;
    }

    return (
        <>
            <h4>
                <FormattedMessage id={'msg.publicLink.times.section'} />
            </h4>
            <LinkAndClipboardCopy
                messageId={'msg.publicLink.times.defaultOn'}
                link={displayLink + '&times=defaultOn'}
            />
            <LinkAndClipboardCopy
                messageId={'msg.publicLink.times.defaultOff'}
                link={displayLink + '&times=defaultOff'}
            />
            <LinkAndClipboardCopy messageId={'msg.publicLink.times.off'} link={displayLink + '&times=off'} />
        </>
    );
};
