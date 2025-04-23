import { generateTimeData } from '../speedSimulator.ts';

import { GpxSegment, ResolvedGpxSegment } from '../../../../common/types.ts';
import { getGpx } from '../../../../common/cache/gpxCache.ts';

export function enrichGpxSegmentsWithTimeStamps(
    gpxSegments: GpxSegment[],
    averageSpeed: number,
    segmentSpeeds: Record<string, number | undefined>
): ResolvedGpxSegment[] {
    return gpxSegments.map((segment) => {
        const gpxContent = getGpx(segment);
        let nextStartDate = '2020-10-10T10:00:00.000Z';
        gpxContent.setStart(nextStartDate);
        gpxContent.tracks.forEach((track) => {
            const usedSpeed = (segmentSpeeds[segment.id] ?? 0) > 0 ? segmentSpeeds[segment.id]! : averageSpeed;
            const generatedPoints = generateTimeData(
                nextStartDate,
                usedSpeed,
                segment.flipped ? track.points.reverse() : track.points
            );
            track.points = generatedPoints;
            // TODO: #200 still need to fix this
            if (generatedPoints.length > 0) {
                const end = generatedPoints[generatedPoints.length - 1].time;
                gpxContent.setEnd(end);
                nextStartDate = track.points[track.points.length - 1].time;
            } else {
                alert(`Segment file with unfilled track: "${segment.filename}" (empty track: "${track.name}")`);
            }
        });
        return {
            ...segment,
            content: gpxContent,
        };
    });
}
