import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../../store/trackMerge.reducer';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FileDownloader } from '../../download/FileDownloader';
import { StreetInfoModal } from '../../ui/elements/StreetInfoModal';
import { useState } from 'react';
import { TrackStreetInfo } from '../../logic/resolving/types';
import { getParsedGpxSegments } from '../../store/segmentData.redux';
import { getGpxContentFromTimedPoints } from '../../../utils/SimpleGPXFromPoints';
import { getCalculateTracks } from '../../calculation/getCalculatedTracks';
import { UnknownWarning } from '../../streets/UnknownWarning';
import { TrackInfoPdfDownloadButton } from '../../download/pdf/trackstreets/TrackInfoPdfDownloadButton';
import { getPlanningLabel } from '../../store/settings.reducer';

export function TrackDocuments({ matchedTrackInfo }: { matchedTrackInfo: TrackStreetInfo | undefined }) {
    const trackCompositions = useSelector(getTrackCompositions);
    const gpxSegments = useSelector(getParsedGpxSegments);
    const calculatedTracks = useSelector(getCalculateTracks);
    const planningLabel = useSelector(getPlanningLabel);

    const [displayStreetInfo, setDisplayStreetInfo] = useState(false);
    if (trackCompositions.length === 0 || gpxSegments.length === 0 || !matchedTrackInfo) {
        return null;
    }
    const calculatedTrack = calculatedTracks.find((track) => track.id === matchedTrackInfo?.id);
    return (
        <div className={'d-flex flex-row'}>
            <TrackInfoPdfDownloadButton trackStreets={matchedTrackInfo} planningLabel={planningLabel} />
            {calculatedTrack && (
                <FileDownloader
                    name={`${calculatedTrack.filename}.gpx`}
                    content={() =>
                        getGpxContentFromTimedPoints(calculatedTrack.points, calculatedTrack.filename ?? 'Track')
                    }
                    id={calculatedTrack.id}
                    color={calculatedTrack.color}
                    label={'GPX'}
                    onlyIcon={true}
                    size={'sm'}
                />
            )}
            <>
                <Button size={'sm'} className={'m-1'} onClick={() => setDisplayStreetInfo(true)}>
                    <UnknownWarning trackId={matchedTrackInfo.id} />
                    <FormattedMessage id={'msg.trackStreetInfo'} />
                </Button>
                {displayStreetInfo && (
                    <StreetInfoModal selectedTrack={matchedTrackInfo} onHide={() => setDisplayStreetInfo(false)} />
                )}
            </>
        </div>
    );
}
