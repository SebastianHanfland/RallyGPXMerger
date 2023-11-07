import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../assets/file-down.svg';
import { getTrackStreetInfo } from './getTrackStreetInfo.ts';
import { BlockedStreetInfo, TrackStreetInfo } from './types.ts';
import { getTimeDifferenceInSeconds } from '../utils/dateUtil.ts';
import { getBlockedStreetInfo } from './getBlockedStreetInfo.ts';

const header = (trackInfo: TrackStreetInfo): string => {
    const duration = getTimeDifferenceInSeconds(trackInfo.end, trackInfo.start) / 60;
    const durationString = `Duration in min;${duration.toFixed(2)}\n`;
    const distance = `Distance in km;${trackInfo.distanceInKm.toFixed(2)}\n`;
    const averageSpeed = `Average speed in km/h;${((trackInfo.distanceInKm / duration) * 60).toFixed(2)}\n`;
    return `Start;${trackInfo.start}\nEnd;${trackInfo.end}\n${durationString}${distance}${averageSpeed}Street;From;To\n`;
};

function convertTrackInfoToCsv(track: TrackStreetInfo): string {
    return (
        header(track) +
        track.wayPoints.map((wayPoint) => `${wayPoint.streetName};${wayPoint.from};${wayPoint.to}`).join('\n')
    );
}

function convertStreetInfoToCsv(blockedStreets: BlockedStreetInfo[]): string {
    return (
        'Street;Blocked from;Blocked until;\n' +
        blockedStreets.map(({ streetName, end, start }) => `${streetName};${start};${end}`).join('\n')
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
    const trackStreetInfos = useSelector(getTrackStreetInfo);
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
