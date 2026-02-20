import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getGaps } from '../logic/calculate/calculatingGaps.ts';
import { getGapToleranceInKm } from '../store/trackMerge.reducer.ts';
import { WarningIcon } from '../../utils/icons/WarningIcon.tsx';

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
