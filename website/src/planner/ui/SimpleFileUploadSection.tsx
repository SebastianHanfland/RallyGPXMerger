import { SimpleGpxSegments } from './SimpleGpxSegments.tsx';
import { PlannerSidebarTrackInfo } from './PlannerSidebarTrackInfo.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { Button, Col, Row } from 'react-bootstrap';
import { downloadSinglePdfFiles } from '../streets/StreetFilesPdfMakeDownloader.tsx';
import download from '../../assets/file-down.svg';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../store/store.ts';
import { FileDownloader } from '../segments/FileDownloader.tsx';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { ExportStateJson } from '../io/ExportStateJson.tsx';
import { TrackName } from './TrackName.tsx';
import { ArrivalDateTimePicker } from '../parameters/ArrivalDateTimePicker.tsx';
import { TrackPeople } from './TrackPeople.tsx';

export function SimpleFileUploadSection() {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const trackCompositions = useSelector(getTrackCompositions);
    const calculatedTracks = useSelector(getCalculatedTracks);
    const trackInfos = useSelector(getEnrichedTrackStreetInfos);
    if (trackCompositions.length === 0) {
        return null;
    }
    const track = trackCompositions[0];
    const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
    const distanceInfo = matchedTrackInfo?.distanceInKm ? ` (${matchedTrackInfo.distanceInKm.toFixed(2)} km)` : '';
    return (
        <div className={'p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>
                <Row>
                    <Col>
                        <span style={{ width: '300px' }}>
                            <TrackName track={track} />
                        </span>
                    </Col>
                    <Col>
                        <span className={'mx-2'}>{`${distanceInfo}`}</span>
                    </Col>
                </Row>
            </h4>
            <Row>
                <Col>
                    <Button
                        size={'sm'}
                        className={'m-1'}
                        onClick={() => dispatch(downloadSinglePdfFiles(intl, track.id))}
                    >
                        <img src={download} alt="download file" className={'m-1'} color={'#ffffff'} />
                        PDF
                    </Button>
                </Col>
                {calculatedTracks.length > 0 && (
                    <Col>
                        <FileDownloader
                            name={`${calculatedTracks[0].filename}.gpx`}
                            content={calculatedTracks[0].content}
                            id={calculatedTracks[0].id}
                            label={'GPX'}
                            onlyIcon={true}
                            size={'sm'}
                        />
                    </Col>
                )}
                <Col>
                    <ExportStateJson label={intl.formatMessage({ id: 'msg.downloadPlanning' })} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TrackPeople track={track} />
                </Col>
                <Col>
                    <ArrivalDateTimePicker noHeader={true} />
                </Col>
            </Row>
            <PlannerSidebarTrackInfo trackInfo={matchedTrackInfo} />
            <SimpleGpxSegments />
        </div>
    );
}
