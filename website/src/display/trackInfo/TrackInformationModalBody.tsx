import { useSelector } from 'react-redux';
import {
    getDisplayPlanningLabel,
    getDisplayTracks,
    getDisplayTrackStreetInfos,
} from '../store/displayTracksReducer.ts';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { getShowSingleTrackInfo } from '../store/map.reducer.ts';
import { DisplayTrack } from '../../common/types.ts';
import { useIntl } from 'react-intl';
import { formatNumber } from '../../utils/numberUtil.ts';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import L from 'leaflet';
import { createTrackStreetPdf } from '../../planner/download/pdf/trackStreetsPdf.ts';
import { DownloadIcon } from '../../utils/icons/DownloadIcon.tsx';
import { TrackFileDownloader } from '../../planner/download/gpx/TrackFileDownloader.tsx';

const cardStyle = {
    style: { width: '170px', height: '145px', cursor: 'default' },
    className: 'startPageCard shadow mb-2 p-2 text-center',
};

function TrackInfo({ track }: { track: DisplayTrack }) {
    const trackStreetInfos = useSelector(getDisplayTrackStreetInfos);
    const planningLabel = useSelector(getDisplayPlanningLabel);
    if (!trackStreetInfos) {
        return null;
    }

    const foundInfo = trackStreetInfos?.find((info) => track.id.includes(info.id));
    if (!foundInfo) {
        return <div>Info not found</div>;
    }
    const intl = useIntl();
    return (
        <>
            <h6>{track.filename}</h6>
            <p className={'p-0 m-0'}>{`Start: ${formatTimeOnly(foundInfo.publicStart ?? foundInfo.startFront)}`}</p>
            {<p className={'p-0 m-0'}>{`Ziel: ${formatTimeOnly(foundInfo.arrivalFront)}`}</p>}
            <p className={'p-0 m-0'}>{`Länge: ${formatNumber(foundInfo.distanceInKm)} km`}</p>
            <div>
                <div>
                    <TrackFileDownloader track={track} />
                    {foundInfo && (
                        <Button
                            size={'sm'}
                            className={'m-1'}
                            onClick={() =>
                                createTrackStreetPdf(intl, planningLabel)(foundInfo).download(`${foundInfo.name}.pdf`)
                            }
                        >
                            <DownloadIcon />
                            PDF
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}

export function TrackInformationModalBody() {
    const tracks = useSelector(getDisplayTracks);
    const singleTrackId = useSelector(getShowSingleTrackInfo);
    const filteredTracks = tracks?.filter((track) => (singleTrackId ? track.id === singleTrackId : true));
    const sortedTracks = [...(filteredTracks ?? [])].sort((a, b) =>
        a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: 'base' })
    );
    if (singleTrackId && sortedTracks.length === 1) {
        return (
            <div className={'text-center'}>
                <TrackInfo track={sortedTracks[0]} />
            </div>
        );
    }

    return (
        <div>
            <Row>
                {sortedTracks?.map((track) => (
                    <Col key={track.id} className={L.Browser.mobile ? 'p-0' : undefined}>
                        <Card {...cardStyle}>
                            <Card.Body className={'track-card m-0 p-0'}>
                                <TrackInfo track={track} />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
