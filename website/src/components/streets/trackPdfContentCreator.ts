import { TrackStreetInfo, TrackWayPointType } from '../../mapMatching/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../../logic/speedSimulator.ts';
import { ContentTable } from 'pdfmake/interfaces';
import { streetInfoHeaderLength } from './StreetFilesjsPdfDownloader.tsx';
import { formatNumber, getHeader } from './trackCsvCreator.ts';

function getAdditionalInfo(
    type: TrackWayPointType | undefined,
    nodeTracks: string[] | undefined,
    breakLength: number | undefined
) {
    if (type === TrackWayPointType.Break) {
        return `: Pause${breakLength ? ` (${breakLength}) min` : ''}`;
    }
    if (type === TrackWayPointType.Node) {
        return `: Knoten${nodeTracks ? ` (${nodeTracks.join(', ')})` : ''}`;
    }
    return '';
}

export function convertTrackInfoToPdfContent(track: TrackStreetInfo): string {
    return track.wayPoints
        .map(
            ({
                streetName,
                postCode,
                district,
                frontArrival,
                frontPassage,
                backArrival,
                pointFrom,
                pointTo,
                type,
                nodeTracks,
                breakLength,
            }) =>
                `${streetName}${getAdditionalInfo(type, nodeTracks, breakLength)};` +
                `${postCode ?? ''};` +
                `${district ?? ''};` +
                `${formatNumber(geoDistance(toLatLng(pointFrom), toLatLng(pointTo)) as number, 2)};` +
                `${formatNumber(getTimeDifferenceInSeconds(frontPassage, frontArrival) / 60, 1)};` +
                `${formatNumber(getTimeDifferenceInSeconds(backArrival, frontArrival) / 60, 1)};` +
                `${formatTimeOnly(frontArrival)};` +
                `${formatTimeOnly(frontPassage)};` +
                `${formatTimeOnly(backArrival)}`
        )
        .join('\n');
}

export function createStreetTable(trackStreets: TrackStreetInfo): ContentTable {
    const streetInfo = convertTrackInfoToPdfContent(trackStreets)
        .replaceAll('Wahlkreis', '')
        .split('\n')
        .map((row) => row.split(';'));

    return {
        layout: 'lightHorizontalLines', // optional
        table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: streetInfo,
        },
    };
}

export function createInfoTable(trackStreets: TrackStreetInfo): ContentTable {
    const trackInfo = getHeader(trackStreets)
        .replaceAll('Wahlkreis', '')
        .split('\n')
        .slice(0, streetInfoHeaderLength)
        .map((row) => row.split(';'));
    return {
        layout: 'lightHorizontalLines', // optional
        table: {
            widths: ['auto', 'auto'],

            body: trackInfo,
        },
    };
}
