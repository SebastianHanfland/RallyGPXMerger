import { useSelector } from 'react-redux';
import { getSingleZipTracks } from '../store/zipTracks.reducer.ts';
import { Button, Card, Col, Row } from 'react-bootstrap';
import download from '../../assets/file-down.svg';
import { getShowSingleTrackInfo } from '../store/map.reducer.ts';
import { ZipTrack } from '../../common/types.ts';
import { FileDownloader } from '../../planner/segments/FileDownloader.tsx';
import { downloadSinglePdfFiles } from '../../planner/streets/StreetFilesPdfMakeDownloader.tsx';
import { storedState } from '../data/loadJsonFile.ts';
import { State } from '../../planner/store/types.ts';
import { useIntl } from 'react-intl';
import { getEnrichedTrackStreetInfos } from '../../planner/logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { formatNumber } from '../../utils/numberUtil.ts';
import { formatTimeOnly, roundStartTimes } from '../../utils/dateUtil.ts';
import { showTimes } from '../store/LoadStateButton.tsx';
import L from 'leaflet';

const cardStyle = {
    style: { width: '170px', height: showTimes ? '145px' : '120px', cursor: 'default' },
    className: 'startPageCard shadow mb-2 p-2 text-center',
};

function TrackInfo({ track }: { track: ZipTrack }) {
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
        <>
            <h6>{track.filename}</h6>
            {showTimes && (
                <p className={'p-0 m-0'}>{`Start: ${formatTimeOnly(
                    roundStartTimes(foundInfo.startFront, track.filename)
                )}`}</p>
            )}
            {showTimes && <p className={'p-0 m-0'}>{`Ziel: ${formatTimeOnly(foundInfo.arrivalFront)}`}</p>}
            <p className={'p-0 m-0'}>{`Länge: ${formatNumber(foundInfo.distanceInKm)} km`}</p>
            <div>
                <div>
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
                </div>
            </div>
        </>
    );
}

export function TrackInformationModalBody() {
    const tracks = useSelector(getSingleZipTracks);
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
