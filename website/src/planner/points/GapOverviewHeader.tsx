import { FormattedMessage } from 'react-intl';
import { WarningIcon } from '../../utils/icons/WarningIcon.tsx';
import { CheckIcon } from '../../utils/icons/CheckIcon.tsx';
import { useOverviewAccordionStatuses } from '../ui/sidebar/complex/overviewStatus.ts';

export function GapOverviewHeader() {
    const { gaps } = useOverviewAccordionStatuses();

    if (!gaps.warning) {
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
            {gaps.gapCount} <FormattedMessage id={'msg.gaps'} />
        </div>
    );
}
