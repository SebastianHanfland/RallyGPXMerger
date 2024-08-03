import { useDispatch, useSelector } from 'react-redux';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { Button } from 'react-bootstrap';
import { downloadSinglePdfFiles } from '../streets/StreetFilesPdfMakeDownloader.tsx';
import download from '../../assets/file-down.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/store.ts';
import { FileDownloader } from '../segments/FileDownloader.tsx';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { StreetInfoModal } from './StreetInfoModal.tsx';
import { useState } from 'react';
import { TrackStreetInfo } from '../logic/resolving/types.ts';

export function TrackDocuments({ matchedTrackInfo }: { matchedTrackInfo: TrackStreetInfo | undefined }) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const trackCompositions = useSelector(getTrackCompositions);
    const gpxSegments = useSelector(getGpxSegments);
    const calculatedTracks = useSelector(getCalculatedTracks);
    const [displayStreetInfo, setDisplayStreetInfo] = useState(false);
    if (trackCompositions.length === 0 || gpxSegments.length === 0 || !matchedTrackInfo) {
        return null;
    }
    const track = trackCompositions[0];
    return (
        <div className={'d-flex flex-row'}>
            <Button size={'sm'} className={'m-1'} onClick={() => dispatch(downloadSinglePdfFiles(intl, track.id))}>
                <img src={download} alt="download file" className={'m-1'} color={'#ffffff'} />
                PDF
            </Button>
            {calculatedTracks.map((track) => track.id).includes(matchedTrackInfo?.id) && (
                <FileDownloader
                    name={`${calculatedTracks[0].filename}.gpx`}
                    content={calculatedTracks[0].content}
                    id={calculatedTracks[0].id}
                    label={'GPX'}
                    onlyIcon={true}
                    size={'sm'}
                />
            )}
            <>
                <Button size={'sm'} className={'m-1'} onClick={() => setDisplayStreetInfo(true)}>
                    <FormattedMessage id={'msg.trackStreetInfo'} />
                </Button>
                {displayStreetInfo && (
                    <StreetInfoModal selectedTrack={matchedTrackInfo} onHide={() => setDisplayStreetInfo(false)} />
                )}
            </>
        </div>
    );
}
