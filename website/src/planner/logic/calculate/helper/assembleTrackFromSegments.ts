import { ParsedGpxSegment, ParsedPoint, PointOfInterestType, TrackComposition } from '../../../store/types.ts';
import { instanceOfBreak } from '../../merge/types.ts';
import { resolveGpxSegments } from './solvingHelper.ts';
import { CalculatedTrack2 } from '../../../../common/types.ts';
import geoDistance from 'geo-distance-helper';
import { planningStore } from '../../../store/planningStore.ts';
import { pointsActions } from '../../../store/points.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { getLatLng } from '../../../../utils/pointUtil.ts';
import { formatNumber } from '../../../../utils/numberUtil.ts';
import { DEFAULT_GAP_TOLERANCE, getGapToleranceInKm } from '../../../store/trackMerge.reducer.ts';

function checkForGap(
    lastPoint: ParsedPoint,
    segment: ParsedGpxSegment,
    track: TrackComposition,
    lastSegmentName: string
) {
    const endOfNextSegment = segment.points[segment.points.length - 1];
    const distanceBetweenSegments = geoDistance(getLatLng(lastPoint), getLatLng(endOfNextSegment)) as number;
    const gapToleranceInKm = getGapToleranceInKm(planningStore.getState()) ?? DEFAULT_GAP_TOLERANCE;
    if (distanceBetweenSegments > gapToleranceInKm) {
        const message = `Here is something too far away: track ${track.name}, between '${
            segment.filename
        }' and '${lastSegmentName}: distance is ${formatNumber(distanceBetweenSegments, 2)} km'`;
        planningStore.dispatch(
            pointsActions.addGapPoint({
                id: uuidv4(),
                type: PointOfInterestType.GAP,
                radiusInM: (distanceBetweenSegments * 1000) / 2,
                description: message,
                title: `Too big gap on ${track.name}`,
                lat: (lastPoint.b + endOfNextSegment.b) / 2,
                lng: (lastPoint.l + endOfNextSegment.l) / 2,
            })
        );
    }
}

function clearAllGaps() {
    planningStore.dispatch(pointsActions.removeAllGapPoint());
}

function getPointsEndingAtTime(gpxOrBreak: ParsedGpxSegment, endTime: number): ParsedPoint[] {
    const points = gpxOrBreak.points;
    const secondsOfSegment = points[points.length - 1].t;

    return points.map((point) => ({ ...point, t: endTime - (point.t - secondsOfSegment) }));
}

export function assembleTrackFromSegments(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[]
): CalculatedTrack2 | null {
    let arrivalTimeForPreviousSegment = track.delayAtEndInSeconds ?? 0;
    let trackPoints: ParsedPoint[] = [];
    clearAllGaps();

    const gpxSegmentContents = resolveGpxSegments(track, gpxSegments);
    let lastPoint: ParsedPoint | undefined = undefined;
    let lastSegmentName: string = '';
    gpxSegmentContents
        .reverse()
        .filter((entry) => entry !== undefined)
        .forEach((gpxOrBreak) => {
            if (instanceOfBreak(gpxOrBreak)) {
                arrivalTimeForPreviousSegment = arrivalTimeForPreviousSegment + gpxOrBreak.minutes * 60;
            } else {
                if (!!lastPoint) {
                    checkForGap(lastPoint, gpxOrBreak, track, lastSegmentName);
                }

                const shiftedPoint = getPointsEndingAtTime(gpxOrBreak, arrivalTimeForPreviousSegment);
                arrivalTimeForPreviousSegment = shiftedPoint[0].t;
                trackPoints = [...shiftedPoint, ...trackPoints];

                lastPoint = shiftedPoint[0];
                lastSegmentName = gpxOrBreak.filename;
            }
        });

    if (trackPoints.length === 0) {
        return null;
    }

    return {
        id: track.id,
        filename: track.name!,
        points: trackPoints,
        peopleCount: track.peopleCount ?? 0,
    };
}
