import { FileUploader } from 'react-drag-drop-files';
import { useDispatch, useSelector } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { gpxShortener } from '../io/gpxShortener.ts';
import { GpxSegment } from '../../common/types.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { resolveStreetNames } from '../logic/resolving/streets/mapMatchingStreetResolver.ts';
import { AppDispatch } from '../store/store.ts';
import { TrackSegmentSelection } from '../tracks/TrackSegmentSelection.tsx';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { GpxCreationHint } from '../segments/GpxCreationHint.tsx';

const fileTypes = ['GPX'];

export async function toGpxSegment(file: File): Promise<GpxSegment> {
    return file.arrayBuffer().then((buffer) => ({
        id: uuidv4(),
        filename: file.name.replace('.gpx', ''),
        content: gpxShortener(new TextDecoder().decode(buffer)),
    }));
}

export function SimpleGpxSegments() {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const trackCompositions = useSelector(getTrackCompositions);
    const track = trackCompositions[0];

    if (!track) {
        dispatch(trackMergeActions.addTrackComposition());
        return null;
    }

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map(toGpxSegment))
            .then((newGpxSegments) => {
                dispatch(gpxSegmentsActions.addGpxSegments(newGpxSegments));
                dispatch(
                    trackMergeActions.setSegments({
                        id: track.id,
                        segments: [...track.segmentIds, ...newGpxSegments.map((segment) => segment.id)],
                    })
                );
                dispatch(triggerAutomaticCalculation);
            })
            .then(() => dispatch(resolveStreetNames));
    };
    return (
        <div>
            <h5>
                <FormattedMessage id={'msg.segments'} />
            </h5>
            <TrackSegmentSelection track={track} hideSelect={true} />
            <h4>
                <FormattedMessage id={'msg.uploadGpx.title'} />
            </h4>
            <GpxCreationHint />
            <FileUploader
                handleChange={handleChange}
                name="file"
                types={fileTypes}
                multiple={true}
                label={intl.formatMessage({ id: 'msg.uploadFile' })}
            />
        </div>
    );
}
