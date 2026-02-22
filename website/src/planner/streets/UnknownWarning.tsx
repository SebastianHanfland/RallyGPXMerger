import { useSelector } from 'react-redux';
import { getTrackStreetInfos } from '../calculation/getTrackStreetInfos.ts';
import { wayPointHasUnknown } from './unknownUtil.ts';
import { WarningIcon } from '../../utils/icons/WarningIcon.tsx';
import { useIntl } from 'react-intl';

interface Props {
    trackId: string;
    withText?: boolean;
}

export function UnknownWarning({ trackId, withText }: Props) {
    const trackStreetInfos = useSelector(getTrackStreetInfos);
    const intl = useIntl();
    const unknown = intl.formatMessage({ id: 'msg.unknown' });

    const foundInfo = trackStreetInfos.find((info) => info.id === trackId);
    if (!foundInfo) {
        return null;
    }
    const numberOfUnknown = foundInfo.wayPoints.filter((waypoint) => wayPointHasUnknown(waypoint, unknown)).length;
    if (numberOfUnknown === 0) {
        return null;
    }

    const text = intl.formatMessage({ id: 'msg.numberOfUnknown' }, { amount: numberOfUnknown });
    return (
        <span title={text}>
            <WarningIcon size={withText ? 30 : 13} />
            {withText && <span>{text}</span>}
        </span>
    );
}
