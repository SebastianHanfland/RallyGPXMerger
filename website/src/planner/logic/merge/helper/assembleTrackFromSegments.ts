import { PointOfInterestType, TrackComposition } from '../../../store/types.ts';
import { instanceOfBreak } from '../types.ts';
import { resolveGpxSegments } from './solvingHelper.ts';
import { shiftDateBySeconds, shiftEndDate } from '../../../../utils/dateUtil.ts';
import { CalculatedTrack } from '../../../../common/types.ts';
import geoDistance from 'geo-distance-helper';
import { planningStore } from '../../../store/planningStore.ts';
import { pointsActions } from '../../../store/points.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { getLatLng } from '../../../../utils/pointUtil.ts';
import { formatNumber } from '../../../../utils/numberUtil.ts';
import { DEFAULT_GAP_TOLERANCE, getGapToleranceInKm } from '../../../store/trackMerge.reducer.ts';
import { ParsedGpxSegment, TimedPoint } from '../../../new-store/types.ts';

function checkForGap(
    lastPoint: TimedPoint,
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

function getPointsEndingAtTime(gpxOrBreak: ParsedGpxSegment, endTime: string): TimedPoint[] {
    const points = gpxOrBreak.points;
    const secondsOfSegment = points[points.length - 1].t;

    return points.map((point) => ({ ...point, t: shiftDateBySeconds(endTime, point.t - secondsOfSegment) }));
}

export function assembleTrackFromSegments(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[],
    initialEndDate: string
): CalculatedTrack | null {
    let arrivalTimeForPreviousSegment = initialEndDate;
    let trackPoints: TimedPoint[] = [];
    clearAllGaps();

    const gpxSegmentContents = resolveGpxSegments(track, gpxSegments);
    let lastPoint: TimedPoint | undefined = undefined;
    let lastSegmentName: string = '';
    gpxSegmentContents
        .reverse()
        .filter((entry) => entry !== undefined)
        .forEach((gpxOrBreak) => {
            if (instanceOfBreak(gpxOrBreak)) {
                arrivalTimeForPreviousSegment = shiftEndDate(arrivalTimeForPreviousSegment, gpxOrBreak.minutes);
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
