import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { BlockedStreetInfo, TrackStreetInfo } from '../logic/resolving/types.ts';
import { getBlockedStreetInfo } from '../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { createBlockedStreetsPdf } from '../download/pdf/blockedStreetsPdf.ts';
import { createTrackStreetPdf } from '../download/pdf/trackStreetsPdf.ts';

const downloadFiles = (trackStreetInfos: TrackStreetInfo[], blockedStreetInfos: BlockedStreetInfo[]) => {
    trackStreetInfos.forEach(createTrackStreetPdf);
    createBlockedStreetsPdf(blockedStreetInfos);
};

export const StreetFilesPdfMakeDownloader = () => {
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    return (
        <Button
            onClick={() => downloadFiles(trackStreetInfos, blockedStreetInfos)}
            disabled={trackStreetInfos.length === 0}
            title={'Download all GPX files for the tracks'}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            Download Street files as pdf
        </Button>
    );
};
