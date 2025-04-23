import * as xml2js from 'xml2js';
import { parseNumbers } from 'xml2js/lib/processors';
import { GpxJson } from './gpxTypes.ts';

export class GpxParser {
    constructor() {}

    async parse(gpxstring: string): Promise<GpxJson> {
        const parserOptions: xml2js.ParserOptions = {
            tagNameProcessors: [parseNumbers],
            attrNameProcessors: [parseNumbers],
            valueProcessors: [parseNumbers],
            attrValueProcessors: [parseNumbers],
            preserveChildrenOrder: true,
            trim: true,
            explicitArray: false,
            mergeAttrs: true,
        };
        let parser = new xml2js.Parser(parserOptions);
        let jsonReturn: GpxJson = {} as GpxJson;
        try {
            let result = await parser.parseStringPromise(gpxstring);
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
