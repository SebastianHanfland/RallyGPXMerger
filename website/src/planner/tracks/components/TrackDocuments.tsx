import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FileDownloader } from '../../download/FileDownloader.tsx';
import { StreetInfoModal } from '../../ui/elements/StreetInfoModal.tsx';
import { useState } from 'react';
import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { getGpxContentFromTimedPoints } from '../../../utils/SimpleGPXFromPoints.ts';
import { getCalculateTracks } from '../../calculation/getCalculatedTracks.ts';
import { UnknownWarning } from '../../streets/UnknownWarning.tsx';
import { TrackInfoPdfDownloadButton } from '../../download/pdf/TrackInfoPdfDownloadButton.tsx';
import { getPlanningLabel } from '../../store/settings.reducer.ts';

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
    const content = getGpxContentFromTimedPoints(calculatedTrack?.points ?? [], calculatedTrack?.filename ?? 'Track');

    return (
        <div className={'d-flex flex-row'}>
            <TrackInfoPdfDownloadButton trackStreets={matchedTrackInfo} planningLabel={planningLabel} />
            {calculatedTrack && (
                <FileDownloader
                    name={`${calculatedTrack.filename}.gpx`}
                    content={content}
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
