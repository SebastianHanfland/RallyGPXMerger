import { FileDownloader } from '../segments/FileDownloader.tsx';
import { ConstructionRemoveFileButton } from './ConstructionRemoveFileButton.tsx';
import { useOnTheFlyCreatedGpx } from '../../utils/gpxUtil.ts';
import { ParsedGpxSegment } from '../store/types.ts';

export function ConstructionFileDisplay({ gpxSegment }: { gpxSegment: ParsedGpxSegment }) {
    const { id, filename } = gpxSegment;
    const content = useOnTheFlyCreatedGpx(gpxSegment);

    return (
        <tr>
            <td>
                <div>{filename}</div>
            </td>
            <td>
                <FileDownloader content={content} name={`${filename}.gpx`} id={id} onlyIcon={true} />
                <ConstructionRemoveFileButton id={id} name={filename} />
            </td>
        </tr>
    );
}
