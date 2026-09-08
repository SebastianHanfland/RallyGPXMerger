import { FormattedMessage, useIntl } from 'react-intl';
import { WarningIcon } from '../../utils/icons/WarningIcon.tsx';
import { CheckIcon } from '../../utils/icons/CheckIcon.tsx';
import { useOverviewAccordionStatuses } from '../ui/sidebar/complex/overviewStatus.ts';

export function PointsOfInterestHeader() {
    const intl = useIntl();
    const { points } = useOverviewAccordionStatuses();
    const pointsLabel = intl.formatMessage({ id: 'msg.points' });
    const pointsOnPublicMapLabel = intl.formatMessage({ id: 'msg.pointsOnPublicMap' });

    if (!points.warning) {
        return (
            <div>
                <CheckIcon />
                <FormattedMessage id={'msg.noOpenPoints'} /> {` (${points.pointCount} ${pointsLabel})`}
                {` (${points.publicPointCount} ${pointsOnPublicMapLabel})`}
            </div>
        );
    }

    return (
        <div>
            <WarningIcon />
            {points.todoCount} <FormattedMessage id={'msg.openTodos'} />
            {` (${points.impedimentCount} ${intl.formatMessage({ id: 'msg.impediments' })})`}
            {` (${points.pointCount} ${pointsLabel})`}
            {` (${points.publicPointCount} ${pointsOnPublicMapLabel})`}
        </div>
    );
}
