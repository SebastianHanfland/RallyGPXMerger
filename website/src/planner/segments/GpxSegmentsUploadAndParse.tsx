import { FileUploader } from 'react-drag-drop-files';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { gpxShortener } from '../io/gpxShortener.ts';
import { GpxSegment } from '../../common/types.ts';
import { useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { toParsedGpxSegment } from './segmentParsing.ts';
import { segmentDataActions } from '../new-store/segmentData.redux.ts';
import { enrichGpxSegmentsWithStreetNames } from '../logic/resolving/street-new/mapMatchingStreetResolver.ts';
import { getAverageSpeedInKmH } from '../store/trackMerge.reducer.ts';

const fileTypes = ['GPX'];

export async function toGpxSegment(file: File): Promise<GpxSegment> {
    return file.arrayBuffer().then((buffer) => ({
        id: uuidv4(),
        filename: file.name.replace('.gpx', ''),
        content: gpxShortener(new TextDecoder().decode(buffer)),
    }));
}

export function GpxSegmentsUploadAndParse() {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map((file) => toParsedGpxSegment(file, averageSpeed))).then((newGpxSegments) =>
            dispatch(enrichGpxSegmentsWithStreetNames(newGpxSegments)).then(({ segments, streetLookup }) => {
                dispatch(segmentDataActions.addGpxSegments(segments));
                dispatch(segmentDataActions.addStreetLookup(streetLookup));
            })
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
