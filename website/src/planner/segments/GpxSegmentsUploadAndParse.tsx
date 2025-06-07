import { FileUploader } from 'react-drag-drop-files';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { toParsedGpxSegment } from './segmentParsing.ts';
import { enrichGpxSegmentsWithStreetNames } from '../logic/resolving/street-new/mapMatchingStreetResolver.ts';
import { getAverageSpeedInKmH } from '../store/trackMerge.reducer.ts';

const fileTypes = ['GPX'];

export function GpxSegmentsUploadAndParse() {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map((file) => toParsedGpxSegment(file, averageSpeed))).then((newGpxSegments) =>
            dispatch(enrichGpxSegmentsWithStreetNames(newGpxSegments))
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
