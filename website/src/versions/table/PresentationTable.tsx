import { useSelector } from 'react-redux';
import { getSingleZipTracks } from '../store/zipTracks.reducer.ts';
import { ZipTrack } from '../../common/types.ts';
import { storedState } from '../data/loadJsonFile.ts';
import { getEnrichedTrackStreetInfos } from '../../planner/logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { useIntl } from 'react-intl';
import { showTimes } from '../store/LoadStateButton.tsx';
import { formatTimeOnly, roundStartTimes } from '../../utils/dateUtil.ts';
import { formatNumber } from '../../utils/numberUtil.ts';
import { FileDownloader } from '../../planner/segments/FileDownloader.tsx';
import { Button } from 'react-bootstrap';
import { downloadSinglePdfFiles } from '../../planner/streets/StreetFilesPdfMakeDownloader.tsx';
import { State } from '../../planner/store/types.ts';
import download from '../../assets/file-down.svg';

export const isInIframe = window.location.search.includes('&iframe');

export const PresentationTable = () => {
    const tracks = useSelector(getSingleZipTracks);

    if (!tracks) {
        return <div>Loading</div>;
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start</th>
                        <th>Ziel</th>
                        <th>GPX</th>
                        <th>PDF</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => (
                        <TrackInfoRow track={track} key={track.id} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

function TrackInfoRow({ track }: { track: ZipTrack }) {
    if (!storedState) {
        return null;
    }
    const trackStreetInfos = getEnrichedTrackStreetInfos(storedState);
    const foundInfo = trackStreetInfos.find((info) => info.id === track.id);
    if (!foundInfo) {
        return <div>Info not found</div>;
    }
    const intl = useIntl();
    return (
        <tr>
            <td>{track.filename}</td>
            <td>{formatTimeOnly(roundStartTimes(foundInfo.startFront, track.filename))}</td>
            <td>{formatTimeOnly(foundInfo.arrivalFront)}</td>
            <td>{formatTimeOnly(formatNumber(foundInfo.distanceInKm))}</td>
            <td>
                <FileDownloader
                    name={`${track.filename}.gpx`}
                    content={track.content}
                    id={track.id}
                    label={'GPX'}
                    onlyIcon={true}
                    size={'sm'}
                />
            </td>
            <td>
                {storedState && showTimes && (
                    <Button
                        size={'sm'}
                        className={'m-1'}
                        onClick={() =>
                            downloadSinglePdfFiles(intl, track.id)(undefined as any, () => storedState as State)
                        }
                    >
                        <img src={download} alt="download file" className={'m-1'} color={'#ffffff'} />
                        PDF
                    </Button>
                )}
            </td>
        </tr>
    );
}
