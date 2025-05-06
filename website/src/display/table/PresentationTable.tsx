import { useSelector } from 'react-redux';
import {
    getDisplayPlanningLabel,
    getDisplayTracks,
    getDisplayTrackStreetInfos,
} from '../store/displayTracksReducer.ts';
import { DisplayTrack } from '../../common/types.ts';
import { useIntl } from 'react-intl';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import { formatNumber } from '../../utils/numberUtil.ts';
import { FileDownloader } from '../../planner/segments/FileDownloader.tsx';
import { Button, Table } from 'react-bootstrap';
import download from '../../assets/file-down.svg';
import { getLink } from '../../utils/linkUtil.ts';
import { createTrackStreetPdf } from '../../planner/download/pdf/trackStreetsPdf.ts';

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

const hideSeconds = true;

function TrackInfoRow({ track }: { track: DisplayTrack }) {
    const trackStreetInfos = useSelector(getDisplayTrackStreetInfos);
    const planningLabel = useSelector(getDisplayPlanningLabel);
    if (!trackStreetInfos) {
        return null;
    }
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
                {formatTimeOnly(foundInfo.publicStart ?? foundInfo.startFront, hideSeconds)}{' '}
                <div>
                    <a href={startLink} target={'_blank'} referrerPolicy={'no-referrer'}>
                        {startStreetName}
                    </a>
                </div>
            </td>
            <td>
                {formatTimeOnly(foundInfo.arrivalFront, hideSeconds)}
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
                {foundInfo && (
                    <Button
                        size={'sm'}
                        className={'m-1'}
                        onClick={() =>
                            createTrackStreetPdf(intl, planningLabel)(foundInfo).download(`${foundInfo.name}.pdf`)
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
