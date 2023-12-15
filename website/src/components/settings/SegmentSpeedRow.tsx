import { GpxSegment } from '../../store/types.ts';

export function SegmentSpeedRow({ gpxSegment }: { gpxSegment: GpxSegment }) {
    const { filename } = gpxSegment;

    return (
        <tr>
            <td>{filename}</td>
            <td>2</td>
        </tr>
    );
}
