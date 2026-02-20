import { ParsedGpxSegment, ParsedPoint, TrackComposition } from '../../../store/types.ts';
import { instanceOfBreak } from '../types.ts';
import { resolveGpxSegments } from './solvingHelper.ts';
import { CalculatedTrack2 } from '../../../../common/types.ts';

function getPointsEndingAtTime(gpxOrBreak: ParsedGpxSegment, endTime: number): ParsedPoint[] {
    const points = gpxOrBreak.points;
    const secondsOfSegment = points[points.length - 1].t;

    return points.map((point) => ({ ...point, t: endTime + (point.t - secondsOfSegment) }));
}

export function assembleTrackFromSegments(track: TrackComposition, gpxSegments: ParsedGpxSegment[]): CalculatedTrack2 {
    let arrivalTimeForPreviousSegment = track.delayAtEndInSeconds ?? 0;
    let trackPoints: ParsedPoint[] = [];

    const gpxSegmentContents = resolveGpxSegments(track, gpxSegments);

    gpxSegmentContents
        .reverse()
        .filter((entry) => entry !== undefined)
        .forEach((gpxOrBreak) => {
            if (instanceOfBreak(gpxOrBreak)) {
                arrivalTimeForPreviousSegment = arrivalTimeForPreviousSegment - gpxOrBreak.minutes * 60;
            } else {
                const shiftedPoint = getPointsEndingAtTime(gpxOrBreak, arrivalTimeForPreviousSegment);
                arrivalTimeForPreviousSegment = shiftedPoint[0].t;
                trackPoints = [...shiftedPoint, ...trackPoints];
            }
        });

    return {
        id: track.id,
        filename: track.name!,
        points: trackPoints,
        color: track.color,
        peopleCount: track.peopleCount ?? 0,
    };
}
