import { GpxJson } from './gpxTypes.ts';
import { X2jOptions, XMLParser } from 'fast-xml-parser';

const parseNumbers = (_: string, attrValue: string, __: string): number | string => {
    return isNaN(Number(attrValue)) ? attrValue : attrValue;
};

export class GpxParser {
    constructor() {}

    parse(gpxString: string): GpxJson {
        const parserOptions: X2jOptions = {
            tagValueProcessor: parseNumbers,
            attributeValueProcessor: parseNumbers,
            parseAttributeValue: true,
            parseTagValue: true,
            ignoreAttributes: false,
            attributeNamePrefix: '',
        };
        const parser = new XMLParser(parserOptions);

        const jsonReturn: GpxJson = {} as GpxJson;
        try {
            const result = parser.parse(gpxString);
            jsonReturn.metadata = result.gpx.metadata;
            jsonReturn.wpt = result.gpx.wpt;
            if (result.gpx.rte) {
                if (Array.isArray(result.gpx.rte)) {
                    jsonReturn.rte = result.gpx.rte;
                } else {
                    jsonReturn.rte = [result.gpx.rte];
                }
            }

            if (Array.isArray(result.gpx.trk)) {
                jsonReturn.trk = result.gpx.trk;
            } else {
                jsonReturn.trk = [result.gpx.trk];
            }
        } catch (e) {
            console.error(e);
        }

        return jsonReturn;
    }
}
