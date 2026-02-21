import { ParsedGpxSegment } from '../planner/store/types.ts';
import { GeoCodingStateOld } from '../planner/store/typesOld.ts';
import { toKey } from '../planner/logic/resolving/helper/pointKeys.ts';
import { ReplacementWayPoint } from '../planner/logic/resolving/types.ts';

export function getWayPointKey(wayPoint: ReplacementWayPoint) {
    const lat = (wayPoint.pointTo.lat + wayPoint.pointFrom.lat) / 2;
    const lon = (wayPoint.pointTo.lon + wayPoint.pointFrom.lon) / 2;
    const postCodeKey = toKey({ lat, lon });
    return { lat, lon, postCodeKey };
}

export const createPostCodeAndDistrictLookups = (
    parsedSegments: ParsedGpxSegment[],
    geoCoding: GeoCodingStateOld,
    streetLookup: Record<number, string>
): { postCodeLookup: Record<number, string>; districtLookup: Record<number, string> } => {
    let postCodeLookup: Record<number, string> = {};
    let districtLookup: Record<number, string> = {};

    parsedSegments.forEach((segment) => {
        segment.points.forEach((point) => {
            const streetName = streetLookup[point.s];

            let district: string | null = null;
            let postCode: string | null = null;
            geoCoding.trackStreetInfos?.forEach((trackInfo) => {
                const foundWayPoint = trackInfo.wayPoints.find((wayPoint) => {
                    return (
                        wayPoint.streetName === streetName &&
                        wayPoint.pointFrom.lat === point.b &&
                        wayPoint.pointFrom.lon === point.l
                    );
                });
                if (foundWayPoint && geoCoding.resolvedPostCodes && geoCoding.resolvedDistricts) {
                    const postCodeKey = getWayPointKey(foundWayPoint).postCodeKey;
                    const foundPostCode = geoCoding.resolvedPostCodes[postCodeKey];
                    district = geoCoding.resolvedDistricts[postCodeKey];
                    postCode = foundPostCode ? `${foundPostCode}` : null;
                    if (postCode) {
                        postCodeLookup = { ...postCodeLookup, ...{ [point.s]: postCode } };
                    }
                    if (district) {
                        districtLookup = { ...districtLookup, ...{ [point.s]: district } };
                    }
                }
            });
        });
    });
    return { postCodeLookup, districtLookup };
};
