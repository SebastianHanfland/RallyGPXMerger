import { GpxSegment } from '../store/types.ts';
import { FileDownloader } from '../segments/FileDownloader.tsx';
import { ConstructionRemoveFileButton } from './ConstructionRemoveFileButton.tsx';

export function ConstructionFileDisplay({ gpxSegment }: { gpxSegment: GpxSegment }) {
    const { id, filename, content } = gpxSegment;

    return (
        <tr>
            <td>
                <div>{filename}</div>
            </td>
            <td>
                <FileDownloader content={content} name={filename} id={id} onlyIcon={true} />
                <ConstructionRemoveFileButton id={id} name={filename} />
            </td>
        </tr>
    );
}
