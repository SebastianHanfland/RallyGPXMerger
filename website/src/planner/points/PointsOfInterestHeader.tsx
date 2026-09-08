import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { WarningIcon } from '../../utils/icons/WarningIcon.tsx';
import { CheckIcon } from '../../utils/icons/CheckIcon.tsx';
import { getPoints } from '../store/points.reducer.ts';
import { pointOfInterestTypesByGroup } from './pointOfInterestConfig.ts';

export function PointsOfInterestHeader() {
    const points = useSelector(getPoints) ?? [];
    const intl = useIntl();
    const pointsLabel = intl.formatMessage({ id: 'msg.points' });
    const pointsOnPublicMapLabel = intl.formatMessage({ id: 'msg.pointsOnPublicMap' });

    const todoPoints = points.filter((point) => pointOfInterestTypesByGroup.todo.includes(point.type));
    const impedimentPoints = points.filter((point) => pointOfInterestTypesByGroup.impediment.includes(point.type));
    const publicPoints = points.filter((point) => pointOfInterestTypesByGroup.public.includes(point.type));
    const problemPoints = [...todoPoints, ...impedimentPoints];
    if (problemPoints.length === 0) {
        return (
            <div>
                <CheckIcon />
                <FormattedMessage id={'msg.noOpenPoints'} /> {` (${points.length} ${pointsLabel})`}
                {` (${publicPoints.length} ${pointsOnPublicMapLabel})`}
            </div>
        );
    }

    return (
        <div>
            <WarningIcon />
            {todoPoints.length} <FormattedMessage id={'msg.openTodos'} />
            {` (${impedimentPoints.length} ${intl.formatMessage({ id: 'msg.impediments' })})`}
            {` (${points.length} ${pointsLabel})`}
            {` (${publicPoints.length} ${pointsOnPublicMapLabel})`}
        </div>
    );
}
