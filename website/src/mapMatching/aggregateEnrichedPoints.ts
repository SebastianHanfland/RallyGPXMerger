import { Point } from 'gpxparser';
import date from 'date-and-time';
import { PARTICIPANTS_DELAY_IN_SECONDS } from '../store/trackMerge.reducer.ts';
import { TrackWayPointType } from './types.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../logic/speedSimulator.ts';

export interface EnrichedPoints extends PointS {
    street: string;
}

export interface PointS extends Omit<Point, 'time'> {
    time: string;
}

interface AggregatedPoints {
    streetName: string;
    frontArrival: string;
    frontPassage: string;
    backArrival: string;
    pointFrom: { lat: number; lon: number };
    pointTo: { lat: number; lon: number };
    type?: TrackWayPointType;
}

export function anyStreetNameMatch(streetName: string, lastStreetName: string): boolean {
    const streetNameElements = streetName.split(', ');
    return lastStreetName.startsWith(streetNameElements[0]);
}

export function takeMostDetailedStreetName(streetName: string, lastStreetName: string): string {
    if (!anyStreetNameMatch(streetName, lastStreetName)) {
        return streetName;
    }
    const streetNameElements = streetName.split(', ');
    const lastStreetNameElements = lastStreetName.split(', ');
    return [...new Set([...lastStreetNameElements, ...streetNameElements])].join(', ');
}

const extractLatLon = ({ lat, lon }: EnrichedPoints) => ({ lat, lon });

function shiftEndTimeByParticipants(endDateTime: string, participants: number): string {
    return date.addSeconds(new Date(endDateTime), participants * PARTICIPANTS_DELAY_IN_SECONDS).toISOString();
}

export function aggregateEnrichedPoints(enrichedPoints: EnrichedPoints[], participants: number): AggregatedPoints[] {
    const aggregatedPoints: AggregatedPoints[] = [];
    enrichedPoints.forEach((point, index) => {
        if (point.street === 'Unknown' && index === 0) {
            return;
        }
        if (aggregatedPoints.length === 0) {
            aggregatedPoints.push({
                streetName: point.street,
                backArrival: shiftEndTimeByParticipants(point.time, participants),
                frontPassage: point.time,
                frontArrival: point.time,
                pointFrom: extractLatLon(point),
                pointTo: extractLatLon(point),
            });
            return;
        }

        const lastIndex = aggregatedPoints.length - 1;
        const lastElement = aggregatedPoints[lastIndex];

        if (point.street === 'Unknown' && index > 0 && enrichedPoints[index - 1].street !== 'Unknown') {
            aggregatedPoints[lastIndex] = {
                ...lastElement,
                backArrival: shiftEndTimeByParticipants(point.time, participants),
                frontPassage: point.time,
                pointTo: extractLatLon(point),
            };
            return;
        }

        if (point.street === 'Unknown' && index > 1 && enrichedPoints[index - 2].street !== 'Unknown') {
            aggregatedPoints[lastIndex] = {
                ...lastElement,
                backArrival: shiftEndTimeByParticipants(point.time, participants),
                frontPassage: point.time,
                pointTo: extractLatLon(point),
            };
            return;
        }

        const lastStreetName = lastElement.streetName;
        const streetName = point.street;

        if ((geoDistance(toLatLng(lastElement.pointTo), toLatLng(point)) as number) < 0.00001) {
            console.log('This is a break', toLatLng(point));
        }

        if (anyStreetNameMatch(streetName, lastStreetName)) {
            const detailedStreetName = takeMostDetailedStreetName(streetName, lastStreetName);
            aggregatedPoints[lastIndex] = {
                ...lastElement,
                streetName: detailedStreetName,
                backArrival: shiftEndTimeByParticipants(point.time, participants),
                frontPassage: point.time,
                pointTo: extractLatLon(point),
            };
        } else {
            aggregatedPoints.push({
                streetName: point.street,
                backArrival: shiftEndTimeByParticipants(point.time, participants),
                frontPassage: point.time,
                frontArrival: point.time,
                pointFrom: extractLatLon(point),
                pointTo: extractLatLon(point),
            });
        }
    });
    return aggregatedPoints;
}
