import * as xml2js from 'xml2js';
import { parseNumbers } from 'xml2js/lib/processors';
import './types';
import { Elevation, GeoJson, GeoJsonFeature, GpxJson, Point, StreamJson, StreamJSONInputOptions } from './gpxTypes.ts';

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

    /**
     * Computes the total distance traveled for a given track
     *
     * @param  {} track - The track which to calculate the total distance
     *
     * @return {number} The total distance traveled, reported in
     */
    calculateTotalDistanceForPoints(points: Point[]): number {
        let totalDistance: number = 0;
        for (let i = 0; i < points.length - 1; i++) {
            totalDistance += this.calculateDistanceBetweenPoints(points[i], points[i + 1]);
        }

        return totalDistance;
    }

    /**
     * Calculate Distance between two points with lat and lon
     *
     * @param  {} wpt1 - A geographic point with lat and lon properties
     * @param  {} wpt2 - A geographic point with lat and lon properties
     *
     * @returns {number} The distance between the two points, returned in kilometers
     */
    calculateDistanceBetweenPoints(wpt1: Point, wpt2: Point): number {
        const earthRadiusKm = 6371;

        const dLat = this.toRadian(wpt2.lat - wpt1.lat);
        const dLon = this.toRadian(wpt2.lon - wpt1.lon);

        const lat1 = this.toRadian(wpt1.lat);
        const lat2 = this.toRadian(wpt2.lat);

        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }

    calculateGradeAdjustedDistanceBetweenPoints(wpt1: Point, wpt2: Point): number {
        const latLongDist = this.calculateDistanceBetweenPoints(wpt1, wpt2);
        const eleDiff = (wpt2.ele - wpt1.ele) / 1000;
        return Math.sqrt(Math.pow(eleDiff, 2) + Math.pow(latLongDist, 2));
    }

    private toRadian(degree: number): number {
        return (degree * Math.PI) / 180;
    }

    /**
     * Generate Elevation Object from an array of points
     *
     * @param  {Point[]} points - An array of points with ele property
     *
     * @returns {Elevation} An object with negative and positive height difference and average, max and min altitude data
     */
    calculateElevationData(points: Point[]): Elevation {
        let posEleChange = 0,
            negEleChange = 0,
            ret: Elevation = {} as Elevation,
            elevations: number[] = [],
            sum = 0;

        points.forEach((curPoint, index) => {
            let curEle = curPoint.ele;
            if (curEle) {
                elevations.push(curEle);
                sum += curEle;

                if (index < points.length - 1) {
                    let nextEle = points[index + 1].ele;
                    let diff = nextEle - curEle;

                    if (diff < 0) {
                        negEleChange += diff;
                    } else if (diff > 0) {
                        posEleChange += diff;
                    }
                }
            }
        });

        ret.max = Math.max.apply(null, elevations);
        ret.min = Math.min.apply(null, elevations);
        ret.pos = Math.abs(posEleChange);
        ret.neg = Math.abs(negEleChange);
        ret.avg = sum / elevations.length;

        return ret;
    }

    /**
     * Generate a StreamJson object, which comprises easy-to-digest data points in separate arrays.
     *
     * @param  {Point[]} points - An array of points with ele property
     *
     * @returns {StreamJson} An object of arrays where for array A and array B, A[i] is the same timestamp as B[i]
     */
    toStreamJSON(points: Point[], options?: StreamJSONInputOptions): StreamJson {
        let distance: number[] = [0];
        let distanceBelowThreshold: number[] = [0];
        let altitude: number[] = [points[0].ele];
        let gradeAdjustedDistance: number[] = [0];
        let elapsedTime: number[] = [0];
        let movingTime: number[] = [0];
        let extension: any = [];

        for (let i = 1; i < points.length; i++) {
            let point = points[i];
            let prevPoint = points[i - 1];

            const dist = this.calculateDistanceBetweenPoints(prevPoint, point);
            distance[i] = dist;
            gradeAdjustedDistance[i] = this.calculateGradeAdjustedDistanceBetweenPoints(prevPoint, point);

            altitude[i] = point.ele;

            const date1 = new Date(prevPoint.time),
                date2 = new Date(point.time);
            elapsedTime[i] = Math.abs(date2.getTime() - date1.getTime()) / 1000;

            const speedThreshold = options?.speedThreshold ? options.speedThreshold : 5.3;
            if (dist * 3600 > speedThreshold) {
                movingTime[i] = 1;
                distanceBelowThreshold[i] = dist;
            } else {
                movingTime[i] = 0;
                distanceBelowThreshold[i] = 0;
            }

            if (point.extensions) {
                if (options && options.extensionProcessor) {
                    extension[i] = options.extensionProcessor(point.extensions);
                } else {
                    extension[i] = point.extensions;
                }
            }
        }

        return {
            distance,
            altitude: altitude,
            extension,
            gradeAdjustedDistance,
            elapsedTime,
            movingTime,
        } as StreamJson;
    }

    /**
     * Export the GPX object to a GeoJSON formatted Object
     *
     * @returns {} a GeoJSON formatted Object
     */
    toGeoJSON(gpxJson: GpxJson): GeoJson {
        let geoJson = {
            type: 'FeatureCollection',
            features: [] as GeoJsonFeature[],
        };

        gpxJson.trk.forEach((track) => {
            let feature: GeoJsonFeature = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [],
                },
                properties: {
                    name: track.name,
                    cmt: track.cmt,
                    desc: track.desc,
                    src: track.src,
                    number: track.number,
                    link: track.link,
                    type: track.type,
                },
            };

            track.trkseg.trkpt.forEach((pt) => {
                let geoPt = [pt.lon, pt.lat, pt.ele];

                feature.geometry.coordinates.push(geoPt);
            });

            geoJson.features.push(feature);
        });

        gpxJson.rte?.forEach((route) => {
            let feature: GeoJsonFeature = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [],
                },
                properties: {
                    name: route.name,
                    cmt: route.cmt,
                    desc: route.desc,
                    src: route.src,
                    number: route.number,
                    link: route.link,
                    type: route.type,
                },
            };

            route.rtept.forEach((pt) => {
                let geoPt = [pt.lon, pt.lat, pt.ele];

                feature.geometry.coordinates.push(geoPt);
            });

            geoJson.features.push(feature);
        });

        gpxJson.wpt?.forEach((pt) => {
            let feature: GeoJsonFeature = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [],
                },
                properties: {
                    name: pt.name,
                    sym: pt.sym,
                    cmt: pt.cmt,
                    desc: pt.desc,
                },
            };

            feature.geometry.coordinates = [[pt.lon, pt.lat, pt.ele]];

            geoJson.features.push(feature);
        });

        return geoJson;
    }
}
