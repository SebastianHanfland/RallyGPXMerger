import { useSelector } from 'react-redux';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { Button } from 'react-bootstrap';
import { IntlShape, useIntl } from 'react-intl';
import FileSaver from 'file-saver';
import { TrackStreetInfo } from '../logic/resolving/types.ts';
import { formatNumber } from '../../utils/numberUtil.ts';
import { formatTimeOnly, roundStartTimes } from '../../utils/dateUtil.ts';

const headerKeys = [
    'msg.track',
    'msg.distanceInKm',
    'msg.trackPeople',
    'msg.communicatedStart',
    'msg.start',
    'msg.arrival',
    'msg.end',
];

const getBody = (trackStreetInfos: TrackStreetInfo[]): string => {
    return trackStreetInfos
        .map(
            (info) =>
                `${info.name};${formatNumber(info.distanceInKm)};${info.peopleCount ?? ''};
                ${formatTimeOnly(roundStartTimes(info.startFront, info.name))};${formatTimeOnly(
                    info.startFront
                )};${formatTimeOnly(info.arrivalFront)};${formatTimeOnly(info.arrivalBack)}`
        )
        .join('\n');
};

function createCsv(trackStreetInfos: TrackStreetInfo[], name: string, intl: IntlShape) {
    const csv = headerKeys.map((key) => intl.formatMessage({ id: key })).join(';') + '\n' + getBody(trackStreetInfos);
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], { type: 'csv;charset=utf-8' });
    FileSaver.saveAs(blob, `${name}-${new Date().toISOString()}.csv`);
}

export const TrackOverviewDownload = () => {
    const intl = useIntl();
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);

    return (
        <Button onClick={() => createCsv(trackStreetInfos, intl.formatMessage({ id: 'msg.tracks' }), intl)}>
            Download
        </Button>
    );
};
