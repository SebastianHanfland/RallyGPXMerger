import { GpxJson, Point, Route, Track } from './gpxTypes.ts';
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
                    jsonReturn.routes = result.gpx.rte.map(this.mapRoute);
                } else {
                    jsonReturn.routes = [result.gpx.rte].map(this.mapRoute);
                }
            }

            if (Array.isArray(result.gpx.trk)) {
                jsonReturn.tracks = result.gpx.trk.map(this.mapTrack);
            } else {
                jsonReturn.tracks = [result.gpx.trk].map(this.mapTrack);
            }
        } catch (e) {
            console.error(e);
        }

        return jsonReturn;
    }

    mapRoute(gpxRoute: { rtept: Point[] }): Route {
        gpxRoute;
        throw new Error('Method not implemented.');
    }

    mapTrack(gpxTrack: { trkseg: { trkpt: Point[] }; name: string; number: number }): Track {
        return {
            name: gpxTrack.name,
            number: gpxTrack.number ? `${gpxTrack.number}` : undefined,
            points: gpxTrack.trkseg.trkpt,
        };
    }
}
