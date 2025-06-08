import { PointOfInterestType, TrackComposition } from '../../../store/types.ts';
import { mergeSimpleGPXs, SimpleGPX } from '../../../../utils/SimpleGPX.ts';
import { instanceOfBreak } from '../types.ts';
import { resolveGpxSegments } from './solvingHelper.ts';
import { shiftEndDate } from '../../../../utils/dateUtil.ts';
import { CalculatedTrack } from '../../../../common/types.ts';
import geoDistance from 'geo-distance-helper';
import { planningStore } from '../../../store/planningStore.ts';
import { pointsActions } from '../../../store/points.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { getLatLng } from '../../../../utils/pointUtil.ts';
import { formatNumber } from '../../../../utils/numberUtil.ts';
import { DEFAULT_GAP_TOLERANCE, getGapToleranceInKm } from '../../../store/trackMerge.reducer.ts';
import { ParsedGpxSegment, ParsedPoint } from '../../../new-store/types.ts';

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

export function assembleTrackFromSegments(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[],
    initialEndDate: string
): CalculatedTrack | null {
    let arrivalTimeForPreviousSegment = initialEndDate;
    let shiftedGpxContents: SimpleGPX[] = [];
    clearAllGaps();

    const gpxSegmentContents = resolveGpxSegments(track, gpxSegments);
    let lastPoint: ParsedPoint | undefined = undefined;
    let lastSegmentName: string = '';
    gpxSegmentContents.reverse().forEach((gpxOrBreak) => {
        if (!instanceOfBreak(gpxOrBreak)) {
            if (!!lastPoint) {
                checkForGap(lastPoint, gpxOrBreak, track, lastSegmentName);
            }

            gpxOrBreak.gpx.shiftToArrivalTime(arrivalTimeForPreviousSegment);
            arrivalTimeForPreviousSegment = gpxOrBreak.gpx.getStart();
            shiftedGpxContents = [SimpleGPX.fromString(gpxOrBreak.gpx.toString()), ...shiftedGpxContents];

            lastPoint = gpxOrBreak.gpx.getStartPoint();
            lastSegmentName = gpxOrBreak.name;
        } else {
            arrivalTimeForPreviousSegment = shiftEndDate(arrivalTimeForPreviousSegment, gpxOrBreak.minutes);
        }
    });

    if (shiftedGpxContents.length === 0) {
        return null;
    }
    const trackContent = mergeSimpleGPXs(shiftedGpxContents);

    return {
        id: track.id,
        content: trackContent.toString(),
        filename: track.name!,
        peopleCount: track.peopleCount ?? 0,
    };
}
