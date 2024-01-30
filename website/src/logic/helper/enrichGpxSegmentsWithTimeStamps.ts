import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { generateTimeData } from '../speedSimulator.ts';
import { GpxSegment } from '../../planner/store/types.ts';

export function enrichGpxSegmentsWithTimeStamps(
    gpxSegments: GpxSegment[],
    averageSpeed: number,
    segmentSpeeds: Record<string, number | undefined>
) {
    return gpxSegments.map((segment) => {
        const gpxContent = SimpleGPX.fromString(segment.content);
        let nextStartDate = '2020-10-10T10:00:00.000Z';
        gpxContent.tracks.forEach((track) => {
            const usedSpeed = (segmentSpeeds[segment.id] ?? 0) > 0 ? segmentSpeeds[segment.id]! : averageSpeed;
            track.points = generateTimeData(nextStartDate, usedSpeed, track.points);
            nextStartDate = track.points[track.points.length - 1].time.toISOString();
        });
        return {
            ...segment,
            content: gpxContent.toString(),
        };
    });
}
