import { ParsedGpxSegment } from '../planner/store/types.ts';
import { GeoCodingStateOld } from '../planner/store/typesOld.ts';

export const createPostCodeAndDistrictLookups = (
    parsedSegments: ParsedGpxSegment[],
    geoCodingStateOld: GeoCodingStateOld,
    streetLookup: Record<number, string>
): { postCodeLookup: Record<number, string>; districtLookup: Record<number, string> } => {
    let postCodeLookup: Record<number, string> = {};
    let districtLookup: Record<number, string> = {};

    return { postCodeLookup, districtLookup };
};
