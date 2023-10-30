import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { generateTimeData } from '../speedSimulator.ts';
import { GpxSegment } from '../../store/types.ts';

export function enrichGpxSegmentsWithTimeStamps(gpxSegments: GpxSegment[], averageSpeed: number) {
    return gpxSegments.map((segment) => {
        const gpxContent = SimpleGPX.fromString(segment.content);
        gpxContent.tracks.forEach((track) => {
            track.points = generateTimeData('2020-10-10T10:00:00.000Z', averageSpeed, track.points);
        });
        console.log(gpxContent.toString());
        return {
            ...segment,
            content: gpxContent.toString(),
        };
    });
}
