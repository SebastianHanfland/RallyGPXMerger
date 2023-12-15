import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { generateTimeData } from '../speedSimulator.ts';
import { GpxSegment } from '../../store/types.ts';

export function enrichGpxSegmentsWithTimeStamps(
    gpxSegments: GpxSegment[],
    averageSpeed: number,
    segmentSpeeds: Record<string, number | undefined>
) {
    return gpxSegments.map((segment) => {
        const gpxContent = SimpleGPX.fromString(segment.content);
        gpxContent.tracks.forEach((track) => {
            const usedSpeed = (segmentSpeeds[segment.id] ?? 0) > 0 ? segmentSpeeds[segment.id]! : averageSpeed;
            track.points = generateTimeData('2020-10-10T10:00:00.000Z', usedSpeed, track.points);
        });
        return {
            ...segment,
            content: gpxContent.toString(),
        };
    });
}
