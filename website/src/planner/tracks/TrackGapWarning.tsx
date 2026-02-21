import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { WarningIcon } from '../../utils/icons/WarningIcon.tsx';
import { getGapToleranceInKm } from '../store/settings.reducer.ts';
import { getGaps } from '../calculation/getGaps.ts';

interface Props {
    trackId: string;
}

export function TrackGapWarning({ trackId }: Props) {
    const intl = useIntl();
    const gaps = useSelector(getGaps);
    const gapTolerance = useSelector(getGapToleranceInKm);
    const gapsOnTrack = gaps.filter((gap) => gap.trackId === trackId).length;

    if (gapsOnTrack === 0) {
        return null;
    }
    const messageKey = gapsOnTrack === 1 ? 'msg.gapOnTrack' : 'msg.gapsOnTrack';
    return (
        <span
            title={intl.formatMessage(
                { id: messageKey },
                { count: gapsOnTrack, distance: Math.round(gapTolerance * 1000) }
            )}
        >
            <WarningIcon size={13} />
        </span>
    );
}
