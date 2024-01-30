import { FileDownloader } from '../segments/FileDownloader.tsx';
import { ConstructionRemoveFileButton } from './ConstructionRemoveFileButton.tsx';
import { GpxSegment } from '../../common/types.ts';

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
