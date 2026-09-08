import { FormattedMessage } from 'react-intl';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { useOverviewAccordionStatuses } from './overviewStatus.ts';

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
