import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Warning } from '../layout/Warning.tsx';
import { getGaps } from '../logic/calculate/calculatingGaps.ts';

interface Props {
    trackId: string;
}

export function TrackGapWarning({ trackId }: Props) {
    const intl = useIntl();
    const gaps = useSelector(getGaps);
    const gapsOnTrack = gaps.filter((gap) => gap.trackId === trackId).length;

    if (gapsOnTrack === 0) {
        return null;
    }
    const messageKey = gapsOnTrack === 1 ? 'msg.gapOnTrack' : 'msg.gapsOnTrack';
    return (
        <span title={intl.formatMessage({ id: messageKey }, { count: gapsOnTrack })}>
            <Warning />
        </span>
    );
}
