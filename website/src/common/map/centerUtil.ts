import { CalculatedTrack } from '../types.ts';
import { Munich } from './locations.ts';
import { getLatLng } from '../../utils/pointUtil.ts';

export function getCenterPoint(parsedTracks: CalculatedTrack[] | undefined): { lat: number; lng: number } {
    if (!parsedTracks || parsedTracks.length === 0) {
        return Munich;
    }
    const point = parsedTracks[0].points[parsedTracks[0].points.length - 1];
    return getLatLng(point);
}
