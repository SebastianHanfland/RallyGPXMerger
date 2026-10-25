import { CalculatedTrack } from '../types';
import { Munich } from './locations';
import { getLatLng } from '../../utils/pointUtil';

export function getCenterPoint(parsedTracks: CalculatedTrack[] | undefined): { lat: number; lng: number } {
    if (!parsedTracks || parsedTracks.length === 0) {
        return Munich;
    }
    if (parsedTracks[0].points.length === 0) {
        return Munich;
    }
    const point = parsedTracks[0].points[parsedTracks[0].points.length - 1];
    return getLatLng(point);
}
