import { FormattedMessage } from 'react-intl';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { useOverviewAccordionStatuses } from './overviewStatus.ts';

export const OverviewChecksHeader = () => {
    const { checks } = useOverviewAccordionStatuses();

    if (!checks.warning) {
        return (
            <div>
                <CheckIcon />
                <FormattedMessage id={'msg.noUnknownStreets'} />
            </div>
        );
    }

    return (
        <div>
            <WarningIcon />
            <FormattedMessage id={'msg.numberOfUnknown'} values={{ amount: checks.unknownCount }} />
        </div>
    );
};
