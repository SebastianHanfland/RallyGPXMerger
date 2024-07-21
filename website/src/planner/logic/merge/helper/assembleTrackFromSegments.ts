import { PointOfInterestType, TrackComposition } from '../../../store/types.ts';
import { mergeSimpleGPXs, SimpleGPX } from '../../../../utils/SimpleGPX.ts';
import { instanceOfBreak } from '../types.ts';
import { resolveGpxSegments } from './solvingHelper.ts';
import { shiftEndDate } from '../../../../utils/dateUtil.ts';
import { ResolvedCalculatedTrack, ResolvedGpxSegment } from '../../../../common/types.ts';
import { Point } from 'gpxparser';
import geoDistance from 'geo-distance-helper';
import { NamedGpx } from './types.ts';
import { store } from '../../../store/store.ts';
import { pointsActions } from '../../../store/points.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { toLatLng } from '../../../../utils/pointUtil.ts';
import { formatNumber } from '../../../../utils/numberUtil.ts';

function checkForGap(lastPoint: Point, gpxOrBreak: NamedGpx, track: TrackComposition, lastSegmentName: string) {
    const endOfNextSegment = gpxOrBreak.gpx.getEndPoint();
    const distanceBetweenSegments = geoDistance(toLatLng(lastPoint), toLatLng(endOfNextSegment)) as number;
    const gapToleranceInKm = 0.01;
    if (distanceBetweenSegments > gapToleranceInKm) {
        const message = `Here is something too far away: track ${track.name}, between '${
            gpxOrBreak.name
        }' and '${lastSegmentName}: distance is ${formatNumber(distanceBetweenSegments, 2)} km'`;
        store.dispatch(
            pointsActions.addGapPoint({
                id: uuidv4(),
                type: PointOfInterestType.GAP,
                radiusInM: (distanceBetweenSegments * 1000) / 2,
                description: message,
                title: `Too big gap on ${track.name}`,
                lat: (lastPoint.lat + endOfNextSegment.lat) / 2,
                lng: (lastPoint.lon + endOfNextSegment.lon) / 2,
            })
        );
    }
}

function clearAllGaps() {
    store.dispatch(pointsActions.removeAllGapPoint());
}

export function assembleTrackFromSegments(
    track: TrackComposition,
    gpxSegments: ResolvedGpxSegment[],
    initialEndDate: string
): ResolvedCalculatedTrack {
    let arrivalTimeForPreviousSegment = initialEndDate;
    let shiftedGpxContents: SimpleGPX[] = [];
    clearAllGaps();

    const gpxSegmentContents = resolveGpxSegments(track, gpxSegments);
    let lastPoint: Point | undefined = undefined;
    let lastSegmentName: string = '';
    gpxSegmentContents.reverse().forEach((gpxOrBreak) => {
        if (!instanceOfBreak(gpxOrBreak)) {
            if (!!lastPoint) {
                checkForGap(lastPoint, gpxOrBreak, track, lastSegmentName);
            }

            gpxOrBreak.gpx.shiftToArrivalTime(arrivalTimeForPreviousSegment);
            arrivalTimeForPreviousSegment = gpxOrBreak.gpx.getStart();
            shiftedGpxContents = [gpxOrBreak.gpx, ...shiftedGpxContents];

            lastPoint = gpxOrBreak.gpx.getStartPoint();
            lastSegmentName = gpxOrBreak.name;
        } else {
            arrivalTimeForPreviousSegment = shiftEndDate(arrivalTimeForPreviousSegment, gpxOrBreak.minutes);
        }
    });

    const trackContent = mergeSimpleGPXs(shiftedGpxContents);

    return { id: track.id, content: trackContent, filename: track.name!, peopleCount: track.peopleCount ?? 0 };
}
