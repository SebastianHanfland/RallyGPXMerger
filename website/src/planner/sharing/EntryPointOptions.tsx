import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { getPlanningId } from '../store/backend.reducer.ts';
import { CopyToClipboardButton } from './CopyToClipboardButton.tsx';
import { getBaseUrl } from '../../utils/linkUtil.ts';
import { getEntryPointPositions } from '../logic/resolving/selectors/getEntryPointPositions.ts';

const entryStyle = { display: 'flex', justifyContent: 'space-between', margin: '10px' };

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
            <div style={entryStyle}>
                <span>
                    <FormattedMessage id={'msg.publicLink.times.defaultOn'} />:{' '}
                    <b>{displayLink + '&times=defaultOn'}</b>
                </span>
                <CopyToClipboardButton text={displayLink + '&times=defaultOn'} />
            </div>
            <div style={entryStyle}>
                <span>
                    <FormattedMessage id={'msg.publicLink.times.defaultOff'} />:{' '}
                    <b>{displayLink + '&times=defaultOff'}</b>
                </span>
                <CopyToClipboardButton text={displayLink + '&times=defaultOff'} />
            </div>
            <div style={entryStyle}>
                <span>
                    <FormattedMessage id={'msg.publicLink.times.on'} />: <b>{displayLink + '&times=on'}</b>
                </span>
                <CopyToClipboardButton text={displayLink + '&times=on'} />
            </div>
            <div style={entryStyle}>
                <span>
                    <FormattedMessage id={'msg.publicLink.times.off'} />: <b>{displayLink + '&times=off'}</b>
                </span>
                <CopyToClipboardButton text={displayLink + '&times=off'} />
            </div>
        </>
    );
};
