import { FileUploader } from 'react-drag-drop-files';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { getAverageSpeedInKmH, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { toParsedGpxSegment } from '../segments/segmentParsing.ts';
import { enrichGpxSegmentsWithStreetNames } from '../logic/resolving/street-new/mapMatchingStreetResolver.ts';
import { TrackComposition } from '../store/types.ts';

const fileTypes = ['GPX'];

export function GpxSegmentsUploadAndParseAndSetToTrack({ track }: { track: TrackComposition }) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map((file) => toParsedGpxSegment(file, averageSpeed))).then((newGpxSegments) => {
            dispatch(enrichGpxSegmentsWithStreetNames(newGpxSegments));
            dispatch(
                trackMergeActions.setSegments({
                    id: track.id,
                    segments: [...track.segmentIds, ...newGpxSegments.map((segment) => segment.id)],
                })
            );
            dispatch(triggerAutomaticCalculation);
        });
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
