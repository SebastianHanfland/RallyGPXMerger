import { FileUploader } from 'react-drag-drop-files';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../../../store/planningStore';
import { trackMergeActions } from '../../../store/trackMerge.reducer';
import { toParsedGpxSegment } from '../../../segments/segmentParsing';
import { enrichGpxSegmentsWithStreetNames } from '../../../logic/resolving/streets/mapMatchingStreetResolver';
import { SEGMENT, TrackComposition } from '../../../store/types';
import { enrichGpxSegmentsWithPostCodesAndDistricts } from '../../../logic/resolving/streets/enrichWithPostCodeAndDistrict';
import { getAverageSpeedInKmH } from '../../../store/settings.reducer';

const fileTypes = ['GPX'];

export function GpxSegmentsUploadAndParseAndSetToTrack({ track }: { track: TrackComposition }) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);

    const handleChange = (newFiles: File | File[]) => {
        Promise.all([...(newFiles as File[])].map((file) => toParsedGpxSegment(file, averageSpeed))).then(
            (newGpxSegments) => {
                dispatch(enrichGpxSegmentsWithStreetNames(newGpxSegments)).then(() =>
                    dispatch(enrichGpxSegmentsWithPostCodesAndDistricts)
                );
                dispatch(
                    trackMergeActions.setSegments({
                        id: track.id,
                        segments: [
                            ...track.segments,
                            ...newGpxSegments.map((segment) => ({
                                type: SEGMENT,
                                segmentId: segment.id,
                                id: segment.id,
                            })),
                        ],
                    })
                );
            }
        );
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
