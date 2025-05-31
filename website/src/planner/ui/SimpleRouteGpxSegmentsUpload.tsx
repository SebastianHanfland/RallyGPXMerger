import { FileUploader } from 'react-drag-drop-files';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { gpxShortener } from '../io/gpxShortener.ts';
import { GpxSegment } from '../../common/types.ts';
import { useIntl } from 'react-intl';
import { resolveStreetNames } from '../logic/resolving/streets/mapMatchingStreetResolver.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { optionallyCompress } from '../store/compressHelper.ts';
import { addGpxSegments } from '../segments/addGpxSegmentsThunk.ts';

const fileTypes = ['GPX'];

export async function toGpxSegment(file: File): Promise<GpxSegment> {
    return file.arrayBuffer().then((buffer) => ({
        id: uuidv4(),
        filename: file.name.replace('.gpx', ''),
        content: optionallyCompress(gpxShortener(new TextDecoder().decode(buffer))),
    }));
}

export function SimpleRouteGpxSegmentsUpload() {
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
                dispatch(addGpxSegments(newGpxSegments));
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
        <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            multiple={true}
            label={intl.formatMessage({ id: 'msg.uploadFile' })}
        />
    );
}
