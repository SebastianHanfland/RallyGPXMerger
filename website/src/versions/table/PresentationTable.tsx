import { useSelector } from 'react-redux';
import { getDisplayTracks } from '../store/displayTracksReducer.ts';
import { DisplayTrack } from '../../common/types.ts';
import { storedState } from '../data/loadJsonFile.ts';
import { getEnrichedTrackStreetInfos } from '../../planner/logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { useIntl } from 'react-intl';
import { showTimes } from '../store/LoadStateButton.tsx';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import { formatNumber } from '../../utils/numberUtil.ts';
import { FileDownloader } from '../../planner/segments/FileDownloader.tsx';
import { Button, Table } from 'react-bootstrap';
import { downloadSinglePdfFiles } from '../../planner/streets/StreetFilesPdfMakeDownloader.tsx';
import { State } from '../../planner/store/types.ts';
import download from '../../assets/file-down.svg';
import { getLink } from '../../utils/linkUtil.ts';

export const isInIframe = window.location.search.includes('&iframe');

export const PresentationTable = () => {
    const tracks = useSelector(getDisplayTracks);

    if (!tracks) {
        return <div>Loading</div>;
    }

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start</th>
                        <th>Ziel</th>
                        <th>Länge in km</th>
                        <th>Dateien</th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => (
                        <TrackInfoRow track={track} key={track.id} />
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

function TrackInfoRow({ track }: { track: DisplayTrack }) {
    if (!storedState) {
        return null;
    }
    const trackStreetInfos = getEnrichedTrackStreetInfos(storedState);
    const foundInfo = trackStreetInfos.find((info) => track.id.includes(info.id));
    if (!foundInfo) {
        return <div>Info not found</div>;
    }
    const intl = useIntl();

    const { pointFrom: startPoint, streetName: startStreetName } = foundInfo.wayPoints[0];
    const startLink = getLink({ pointFrom: startPoint, pointTo: startPoint });

    const { pointFrom: endPoint, streetName: endStreetName } = foundInfo.wayPoints[foundInfo.wayPoints.length - 1];
    const endLink = getLink({ pointFrom: endPoint, pointTo: endPoint });
    return (
        <tr>
            <td>{track.filename}</td>
            <td>
                {formatTimeOnly(foundInfo.publicStart ?? foundInfo.startFront)}{' '}
                <div>
                    <a href={startLink} target={'_blank'} referrerPolicy={'no-referrer'}>
                        {startStreetName}
                    </a>
                </div>
            </td>
            <td>
                {formatTimeOnly(foundInfo.arrivalFront)}
                <div>
                    <a href={endLink} target={'_blank'} referrerPolicy={'no-referrer'}>
                        {endStreetName}
                    </a>
                </div>
            </td>
            <td>{formatNumber(foundInfo.distanceInKm)}</td>
            <td>
                <FileDownloader
                    name={`${track.filename}.gpx`}
                    content={track.content}
                    id={track.id}
                    label={'GPX'}
                    onlyIcon={true}
                    size={'sm'}
                />
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
