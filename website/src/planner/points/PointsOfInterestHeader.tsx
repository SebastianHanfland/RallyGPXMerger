import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { WarningIcon } from '../../utils/icons/WarningIcon.tsx';
import { CheckIcon } from '../../utils/icons/CheckIcon.tsx';
import { getPoints } from '../store/points.reducer.ts';
import { PointOfInterestType } from '../store/types.ts';

export function PointsOfInterestHeader() {
    const points = useSelector(getPoints) ?? [];
    const intl = useIntl();
    const pointsLabel = intl.formatMessage({ id: 'msg.points' });
    const pointsOnPublicMapLabel = intl.formatMessage({ id: 'msg.pointsOnPublicMap' });

    const problemPoints = points.filter((point) =>
        [PointOfInterestType.IMPEDIMENT, PointOfInterestType.TODO].includes(point.type)
    );
    const publicPoints = points.filter((point) =>
        [PointOfInterestType.PUBLIC_COMMENT, PointOfInterestType.GATHERING, PointOfInterestType.TOILET].includes(
            point.type
        )
    );
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
            {points.length} <FormattedMessage id={'msg.openPoints'} />
            {` (${points.length} ${pointsLabel})`}
            {` (${publicPoints.length} ${pointsOnPublicMapLabel})`}
        </div>
    );
}
