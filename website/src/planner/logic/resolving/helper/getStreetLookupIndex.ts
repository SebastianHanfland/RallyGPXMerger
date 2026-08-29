import { ParsedPoint, TimedPoint } from '../../../store/types.ts';

type PointWithStreetLookupIndex = Pick<ParsedPoint | TimedPoint, 's' | 'm'>;

export function getStreetLookupIndex(point: PointWithStreetLookupIndex): number {
    return point.m ?? point.s;
}
