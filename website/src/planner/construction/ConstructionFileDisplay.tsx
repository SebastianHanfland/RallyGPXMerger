import { FileDownloader } from '../download/FileDownloader.tsx';
import { ConstructionRemoveFileButton } from './ConstructionRemoveFileButton.tsx';
import { getGpxContentStringFromParsedSegment } from '../../utils/SimpleGPXFromPoints.ts';
import { ParsedGpxSegment } from '../store/types.ts';

export function ConstructionFileDisplay({ gpxSegment }: { gpxSegment: ParsedGpxSegment }) {
    const { id, filename, color } = gpxSegment;
    return (
        <tr>
            <td>
                <div>{filename}</div>
            </td>
            <td>
                <FileDownloader
                    content={() => getGpxContentStringFromParsedSegment(gpxSegment)}
                    name={`${filename}.gpx`}
                    id={id}
                    onlyIcon={true}
                    color={color}
                />
                <ConstructionRemoveFileButton id={id} name={filename} />
            </td>
        </tr>
    );
}
