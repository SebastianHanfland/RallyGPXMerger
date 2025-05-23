import { useDispatch, useSelector } from 'react-redux';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { Button, Col, Row } from 'react-bootstrap';
import { downloadSinglePdfFiles } from '../streets/StreetFilesPdfMakeDownloader.tsx';
import download from '../../assets/file-down.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { FileDownloader } from '../segments/FileDownloader.tsx';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { ExportStateJson } from '../io/ExportStateJson.tsx';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { StreetInfoModal } from './StreetInfoModal.tsx';
import { useState } from 'react';
import { TrackStreetInfo } from '../logic/resolving/types.ts';

export function TrackInfoDownloadButtons({ matchedTrackInfo }: { matchedTrackInfo: TrackStreetInfo | undefined }) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const trackCompositions = useSelector(getTrackCompositions);
    const gpxSegments = useSelector(getGpxSegments);
    const calculatedTracks = useSelector(getCalculatedTracks);
    const [displayStreetInfo, setDisplayStreetInfo] = useState(false);
    if (trackCompositions.length === 0 || gpxSegments.length === 0) {
        return null;
    }
    const track = trackCompositions.find((tr) => tr.id === matchedTrackInfo?.id);
    const calculatedTrack = calculatedTracks.find((tr) => tr.id === matchedTrackInfo?.id);
    if (!track) {
        return null;
    }
    return (
        <>
            <Row>
                <h5>
                    <FormattedMessage id={'msg.documents.plain'} />
                </h5>
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
                {calculatedTrack && (
                    <Col>
                        <FileDownloader
                            name={`${calculatedTrack.filename}.gpx`}
                            content={calculatedTrack.content}
                            id={calculatedTrack.id}
                            label={'GPX'}
                            onlyIcon={true}
                            size={'sm'}
                        />
                    </Col>
                )}
                {matchedTrackInfo && (
                    <Col>
                        <Button size={'sm'} className={'m-1'} onClick={() => setDisplayStreetInfo(true)}>
                            <FormattedMessage id={'msg.trackStreetInfo'} />
                        </Button>
                        {displayStreetInfo && (
                            <StreetInfoModal
                                selectedTrack={matchedTrackInfo}
                                onHide={() => setDisplayStreetInfo(false)}
                            />
                        )}
                    </Col>
                )}
                <Col>
                    <ExportStateJson label={intl.formatMessage({ id: 'msg.downloadPlanning' })} />
                </Col>
            </Row>
            <hr />
        </>
    );
}
