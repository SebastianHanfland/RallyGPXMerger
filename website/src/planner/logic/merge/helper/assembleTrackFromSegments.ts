import { TrackComposition } from '../../../store/types.ts';
import { mergeSimpleGPXs, SimpleGPX } from '../../../../utils/SimpleGPX.ts';
import { instanceOfBreak } from '../types.ts';
import { resolveGpxSegments } from './solvingHelper.ts';
import { shiftEndDate } from '../../../../utils/dateUtil.ts';
import { CalculatedTrack, GpxSegment } from '../../../../common/types.ts';
import { Point } from 'gpxparser';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../speedSimulator.ts';
import { formatNumber } from '../../../download/csv/trackStreetsCsv.ts';
import { NamedGpx } from './types.ts';

function checkForGap(lastPoint: Point, gpxOrBreak: NamedGpx, track: TrackComposition, lastSegmentName: string) {
    const distanceBetweenSegments = geoDistance(toLatLng(lastPoint), toLatLng(gpxOrBreak.gpx.getEndPoint())) as number;
    if (distanceBetweenSegments > 0.1) {
        console.log(
            `Here is something too far away: track ${track.name}, between '${lastSegmentName}' and '${
                gpxOrBreak.name
            }: distance is ${formatNumber(distanceBetweenSegments, 2)} km'`
        );
    }
}

export function assembleTrackFromSegments(
    track: TrackComposition,
    gpxSegments: GpxSegment[],
    initialEndDate: string
): CalculatedTrack {
    let arrivalTimeForPreviousSegment = initialEndDate;
    let shiftedGpxContents: SimpleGPX[] = [];

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

    const trackContent = mergeSimpleGPXs(shiftedGpxContents).toString();

    return { id: track.id, content: trackContent, filename: track.name!, peopleCount: track.peopleCount ?? 0 };
}
