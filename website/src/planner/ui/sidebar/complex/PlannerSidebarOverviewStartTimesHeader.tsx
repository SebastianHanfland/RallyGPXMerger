import { FormattedMessage } from 'react-intl';
import { CheckIcon } from '../../../../utils/icons/CheckIcon';
import { WarningIcon } from '../../../../utils/icons/WarningIcon';
import { useOverviewAccordionStatuses } from './overviewStatus';

export const PlannerSidebarOverviewStartTimesHeader = () => {
    const { comStart } = useOverviewAccordionStatuses();

    if (!comStart.warning) {
        return (
            <div>
                <CheckIcon />
                <FormattedMessage id="msg.communicatedStart" /> {': '}
                <FormattedMessage id="msg.allTracksHaveStartTimeConfiguration" />
            </div>
        );
    }

    return (
        <div>
            <WarningIcon />
            <FormattedMessage id="msg.communicatedStart" /> {': '}
            <FormattedMessage
                id="msg.tracksWithoutStartTimeConfiguration"
                values={{ amount: comStart.unconfiguredTrackCount }}
            />
        </div>
    );
};
