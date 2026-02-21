import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { WarningIcon } from '../../utils/icons/WarningIcon.tsx';
import { getGapToleranceInKm } from '../store/settings.reducer.ts';
import { getGaps } from '../calculation/getGaps.ts';

export function TracksGapWarning() {
    const intl = useIntl();
    const gaps = useSelector(getGaps).length;
    const gapTolerance = useSelector(getGapToleranceInKm);

    if (gaps === 0) {
        return null;
    }
    const messageKey = gaps === 1 ? 'msg.gapOnTrack' : 'msg.gapsOnTrack';
    return (
        <span
            title={intl.formatMessage({ id: messageKey }, { count: gaps, distance: Math.round(gapTolerance * 1000) })}
        >
            <WarningIcon />
        </span>
    );
}
