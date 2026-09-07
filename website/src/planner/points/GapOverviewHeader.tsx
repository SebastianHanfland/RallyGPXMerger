import { useSelector } from 'react-redux';
import { getGaps } from '../calculation/getGaps.ts';
import { FormattedMessage } from 'react-intl';
import { WarningIcon } from '../../utils/icons/WarningIcon.tsx';
import { CheckIcon } from '../../utils/icons/CheckIcon.tsx';

export function GapOverviewHeader() {
    const gapPoints = useSelector(getGaps) ?? [];

    if (gapPoints.length === 0) {
        return (
            <div>
                <CheckIcon />
                <FormattedMessage id={'msg.noGaps'} />
            </div>
        );
    }

    return (
        <div>
            <WarningIcon />
            {gapPoints.length} <FormattedMessage id={'msg.gaps'} />
        </div>
    );
}
