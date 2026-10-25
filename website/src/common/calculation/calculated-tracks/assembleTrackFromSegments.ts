import { ParsedGpxSegment, ParsedPoint, TrackComposition } from '../../../planner/store/types';
import { instanceOfBreak } from '../types';
import { resolveGpxSegments } from './solvingHelper';
import { PreCalculatedTrack } from '../../types';
import { getPointsEndingAtTime } from '../lastPointUtil';

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
