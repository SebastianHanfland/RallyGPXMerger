import { TrackStreetInfo } from '../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { IntlShape } from 'react-intl';

export const getTrackTableHeaders = (intl: IntlShape) =>
    [
        'msg.street',
        'msg.postCode',
        'msg.district',
        'msg.lengthInKm',
        'msg.speed',
        'msg.durationInMin',
        'msg.blockageInMin',
        'msg.arrivalOfFront',
        'msg.passageOfFront',
        'msg.passageOfBack',
    ].map((key) => intl.formatMessage({ id: key }));

export const getHeader = (trackInfo: TrackStreetInfo, intl: IntlShape): string => {
    const duration = getTimeDifferenceInSeconds(trackInfo.arrivalBack, trackInfo.startFront) / 60;
    const durationString = `${intl.formatMessage({ id: 'msg.durationInMin' })};${duration.toFixed(2)}\n`;
    const distance = `${intl.formatMessage({ id: 'msg.distanceInKm' })};${trackInfo.distanceInKm.toFixed(2)}\n`;
    const averageSpeed = `${intl.formatMessage({ id: 'msg.averageSpeed' })};${(
        (trackInfo.distanceInKm / duration) *
        60
    ).toFixed(2)}\n`;

    const times = `${intl.formatMessage({ id: 'msg.start' })};${formatTimeOnly(
        trackInfo.startFront
    )}\n${intl.formatMessage({ id: 'msg.arrivalOfFront' })};${formatTimeOnly(
        trackInfo.arrivalFront
    )}\n${intl.formatMessage({ id: 'msg.arrivalOfBack' })};${formatTimeOnly(trackInfo.arrivalBack)}\n`;
    const peopleCount = `# ${intl.formatMessage({ id: 'msg.people' })}:;${trackInfo.peopleCount ?? ''}\n`;

    const tableHeaders = getTrackTableHeaders(intl).join(';') + '\n';

    return `${times}${durationString}${distance}${averageSpeed}${peopleCount}${tableHeaders}`;
};
