import { FormattedMessage } from 'react-intl';
import { WarningIcon } from '../../utils/icons/WarningIcon';
import { CheckIcon } from '../../utils/icons/CheckIcon';
import { useOverviewAccordionStatuses } from '../ui/sidebar/complex/overviewStatus';

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
