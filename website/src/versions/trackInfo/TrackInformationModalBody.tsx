import { useSelector } from 'react-redux';
import { getSingleZipTracks } from '../store/zipTracks.reducer.ts';
import { Button, Card, Col, Row } from 'react-bootstrap';
import download from '../../assets/file-down.svg';
import { getShowSingleTrackInfo } from '../store/map.reducer.ts';
import { ZipTrack } from '../../common/types.ts';

const cardStyle = {
    style: { width: '170px', height: '170px', cursor: 'pointer' },
    className: 'startPageCard shadow mb-2 p-2 text-center',
};

function TrackInfo({ track }: { track: ZipTrack }) {
    return (
        <>
            <h6>{track.filename}</h6>
            <p className={'p-0 m-0'}>Start: 10:00</p>
            <p className={'p-0 m-0'}>Ziel: 15:00</p>
            <p className={'p-0 m-0'}>Länge: 10 km</p>
            <div>
                <div>
                    <Button size={'sm'}>
                        <img src={download} alt="download file" color={'#ffffff'} />
                        GPX
                    </Button>
                    <Button size={'sm'} className={'mx-2'}>
                        <img src={download} alt="download file" color={'#ffffff'} />
                        PDF
                    </Button>
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
                    <Col key={track.id}>
                        <Card {...cardStyle}>
                            <Card.Body className={'m-0 p-0'}>
                                <TrackInfo track={track} />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
