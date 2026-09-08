import { FormattedMessage } from 'react-intl';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { useOverviewAccordionStatuses } from './overviewStatus.ts';

export const PlannerSidebarOverviewStartNamesHeader = () => {
    const { start } = useOverviewAccordionStatuses();

    if (!start.warning) {
        return (
            <div>
                <CheckIcon />
                <FormattedMessage id="msg.startNameOverwrite" /> {': '}
                <FormattedMessage id="msg.noUnknownOriginalStartNames" />
            </div>
        );
    }

    return (
        <div>
            <WarningIcon />
            <FormattedMessage id="msg.startNameOverwrite" /> {': '}
            <FormattedMessage
                id="msg.numberOfUnknownOriginalStartNames"
                values={{ amount: start.unknownStartNameCount }}
            />
        </div>
    );
};
