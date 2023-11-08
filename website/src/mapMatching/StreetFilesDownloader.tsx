import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../assets/file-down.svg';
import { BlockedStreetInfo, TrackStreetInfo } from './types.ts';
import { getTimeDifferenceInSeconds } from '../utils/dateUtil.ts';
import { getBlockedStreetInfo } from './getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from './getEnrichedTrackStreetInfos.ts';

const header = (trackInfo: TrackStreetInfo): string => {
    const duration = getTimeDifferenceInSeconds(trackInfo.arrivalBack, trackInfo.startFront) / 60;
    const durationString = `Duration in min;${duration.toFixed(2)}\n`;
    const distance = `Distance in km;${trackInfo.distanceInKm.toFixed(2)}\n`;
    const averageSpeed = `Average speed in km/h;${((trackInfo.distanceInKm / duration) * 60).toFixed(2)}\n`;
    const times = `Start;${trackInfo.startFront}\nArrival of front;${trackInfo.arrivalFront}\nArrival of back;${trackInfo.arrivalBack}\n`;
    const tableHeaders = `Street;Post code;Arrival of front;Passage of front;Arrival of back\n`;
    return `${times}${durationString}${distance}${averageSpeed}${tableHeaders}`;
};

function convertTrackInfoToCsv(track: TrackStreetInfo): string {
    return (
        header(track) +
        track.wayPoints
            .map(
                ({ streetName, postCode, frontArrival, frontPassage, backArrival }) =>
                    `${streetName};${postCode};${frontArrival};${frontPassage};${backArrival}`
            )
            .join('\n')
    );
}

function convertStreetInfoToCsv(blockedStreets: BlockedStreetInfo[]): string {
    return (
        'Post code;Street;Blocked from;Blocked until;\n' +
        blockedStreets
            .map(
                ({ postCode, streetName, frontArrival, backPassage }) =>
                    `${postCode};${streetName};${frontArrival};${backPassage}`
            )
            .join('\n')
    );
}

const downloadFiles = (trackStreetInfos: TrackStreetInfo[], blockedStreetInfos: BlockedStreetInfo[]) => {
    const zip = new JSZip();
    trackStreetInfos.forEach((track) => {
        zip.file(
            `${track.name}-${track.distanceInKm.toFixed(2)}km.csv`,
            new Blob([convertTrackInfoToCsv(track)], { type: 'csv' })
        );
    });
    zip.file(`BlockedStreets.csv`, new Blob([convertStreetInfoToCsv(blockedStreetInfos)], { type: 'csv' }));
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, `StreetList-${new Date().toISOString()}.zip`);
    });
};

export const StreetFilesDownloader = () => {
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    return (
        <Button
            onClick={() => downloadFiles(trackStreetInfos, blockedStreetInfos)}
            disabled={trackStreetInfos.length === 0}
            title={'Download all GPX files for the tracks'}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            Download Street files
        </Button>
    );
};
