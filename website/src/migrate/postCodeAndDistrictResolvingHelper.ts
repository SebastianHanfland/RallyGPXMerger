import { ParsedGpxSegment } from '../planner/store/types.ts';
import { GeoCodingStateOld } from '../planner/store/typesOld.ts';
import { getWayPointKey } from '../planner/logic/resolving/helper/pointKeys.ts';

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
            console.log({ point, streetName, streetLookup });
            geoCoding.trackStreetInfos?.forEach((trackInfo) => {
                const foundWayPoint = trackInfo.wayPoints.find((wayPoint) => {
                    return (
                        wayPoint.streetName === streetName &&
                        wayPoint.pointFrom.lat === point.b &&
                        wayPoint.pointFrom.lon === point.l
                    );
                });
                if (foundWayPoint && geoCoding.resolvedPostCodes && geoCoding.resolvedDistricts) {
                    console.log('there are stuff');
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
                if (foundWayPoint) {
                    console.log('there are stuff');
                }
            });
            console.log({ streetName, district, postCode });
        });
    });
    return { postCodeLookup, districtLookup };
};
