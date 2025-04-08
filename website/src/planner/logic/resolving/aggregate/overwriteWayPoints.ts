import { ReplacementWayPoint, StreetNameReplacementWayPoint } from '../types.ts';
import { sameWayPoint } from '../../../store/geoCoding.reducer.ts';

export function overwriteWayPoints<T extends ReplacementWayPoint>(
    wayPoints: T[],
    replacementWayPoints: StreetNameReplacementWayPoint[]
): T[] {
    return wayPoints.map((point) => {
        const pointToReplaceWith = replacementWayPoints.find((replacementPoint) =>
            sameWayPoint(replacementPoint, point)
        );
        if (pointToReplaceWith) {
            return { ...point, streetName: pointToReplaceWith.streetName };
        } else {
            return point;
        }
    });
}
