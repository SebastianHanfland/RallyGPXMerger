import { useSelector } from 'react-redux';
import {
    getDisplayPlanningLabel,
    getDisplayTracks,
    getDisplayTrackStreetInfos,
} from '../store/displayTracksReducer.ts';
import { Card, Col, Row } from 'react-bootstrap';
import { getShowSingleTrackInfo } from '../store/displayMapReducer.ts';
import { CalculatedTrack } from '../../common/types.ts';
import { formatNumber } from '../../utils/numberUtil.ts';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import L from 'leaflet';
import { TrackFileDownloader } from '../../planner/download/gpx/TrackFileDownloader.tsx';
import { TrackInfoPdfDownloadButton } from '../../planner/download/pdf/TrackInfoPdfDownloadButton.tsx';

const cardStyle = {
    style: { width: '170px', height: '145px', cursor: 'default' },
    className: 'startPageCard shadow mb-2 p-2 text-center',
};

function TrackInfo({ track }: { track: CalculatedTrack }) {
    const trackStreetInfos = useSelector(getDisplayTrackStreetInfos);
    const planningLabel = useSelector(getDisplayPlanningLabel);
    if (!trackStreetInfos) {
        return null;
    }

    const foundInfo = trackStreetInfos?.find((info) => track.id.includes(info.id));
    if (!foundInfo) {
        return <div>Info not found</div>;
    }
    return (
        <>
            <h6>{track.filename}</h6>
            <p className={'p-0 m-0'}>{`Start: ${formatTimeOnly(foundInfo.publicStart ?? foundInfo.startFront)}`}</p>
            {<p className={'p-0 m-0'}>{`Ziel: ${formatTimeOnly(foundInfo.arrivalFront)}`}</p>}
            <p className={'p-0 m-0'}>{`Länge: ${formatNumber(foundInfo.distanceInKm)} km`}</p>
            <div>
                <div>
                    <TrackFileDownloader track={track} />
                    {foundInfo && <TrackInfoPdfDownloadButton trackStreets={foundInfo} planningLabel={planningLabel} />}
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
