import { FormattedMessage } from 'react-intl';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { useOverviewAccordionStatuses } from './overviewStatus.ts';

export const PlannerSidebarOverviewEntryPointsHeader = () => {
    const { entryPoints } = useOverviewAccordionStatuses();

    if (!entryPoints.warning) {
        return (
            <div>
                <CheckIcon />
                <FormattedMessage id="msg.allEntryPointsConfigured" />
            </div>
        );
    }

    return (
        <div>
            <WarningIcon />
            <FormattedMessage
                id="msg.entryPointsMissingConfiguration"
                values={{ amount: entryPoints.incompleteEntryPointCount }}
            />
        </div>
    );
};
