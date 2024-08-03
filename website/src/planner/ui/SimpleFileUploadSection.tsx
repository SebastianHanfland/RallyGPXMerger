import { SimpleGpxSegments } from './SimpleGpxSegments.tsx';
import { PlannerSidebarTrackInfo } from './PlannerSidebarTrackInfo.tsx';
import { PlannerSidebarTrackFormDetails } from './PlannerSidebarTrackFormDetails.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { Button } from 'react-bootstrap';
import { downloadSinglePdfFiles } from '../streets/StreetFilesPdfMakeDownloader.tsx';
import download from '../../assets/file-down.svg';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../store/store.ts';
import { FileDownloader } from '../segments/FileDownloader.tsx';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { ExportStateJson } from '../io/ExportStateJson.tsx';

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
                <span className={'mx-2'}>{`${track.name}${distanceInfo}`}</span>
            </h4>
            <Button size={'sm'} className={'m-1'} onClick={() => dispatch(downloadSinglePdfFiles(intl, track.id))}>
                <img src={download} alt="download file" className={'m-1'} color={'#ffffff'} />
                PDF
            </Button>
            {calculatedTracks.length > 0 && (
                <FileDownloader
                    name={`${calculatedTracks[0].filename}.gpx`}
                    content={calculatedTracks[0].content}
                    id={calculatedTracks[0].id}
                    label={'GPX'}
                    onlyIcon={true}
                    size={'sm'}
                />
            )}
            <ExportStateJson label={intl.formatMessage({ id: 'msg.downloadPlanning' })} />
            <PlannerSidebarTrackInfo trackInfo={matchedTrackInfo} />
            <PlannerSidebarTrackFormDetails track={track} />
            <SimpleGpxSegments />
        </div>
    );
}
