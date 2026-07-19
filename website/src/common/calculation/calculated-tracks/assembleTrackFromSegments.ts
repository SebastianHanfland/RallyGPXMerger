import { ParsedGpxSegment, ParsedPoint, TrackComposition } from '../../../planner/store/types.ts';
import { instanceOfBreak } from '../types.ts';
import { resolveGpxSegments } from './solvingHelper.ts';
import { PreCalculatedTrack } from '../../types.ts';
import { getPointsEndingAtTime } from '../lastPointUtil.ts';

export function assembleTrackFromSegments(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[]
): PreCalculatedTrack {
    let arrivalTimeForPreviousSegment = track.delayAtEndInSeconds ? -track.delayAtEndInSeconds : 0;
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
                if (shiftedPoint.length > 0) {
                    arrivalTimeForPreviousSegment = shiftedPoint[0].t;
                    trackPoints = [...shiftedPoint, ...trackPoints];
                }
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
