import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { wayPointHasUnknown } from '../../../streets/unknownUtil.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';

export const OverviewChecksHeader = () => {
    const trackStreetInfos = useSelector(getTrackStreetInfos);
    const intl = useIntl();
    const unknown = intl.formatMessage({ id: 'msg.unknown' });

    let counterUnknown = 0;
    trackStreetInfos.forEach((info) => {
        const numberOfUnknown = info.wayPoints.filter((waypoint) => wayPointHasUnknown(waypoint, unknown)).length;
        counterUnknown += numberOfUnknown;
    });

    if (counterUnknown === 0) {
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
            <FormattedMessage id={'msg.numberOfUnknown'} values={{ amount: counterUnknown }} />
        </div>
    );
};
