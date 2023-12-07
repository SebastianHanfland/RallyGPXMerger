import L from 'leaflet';
import { useSelector } from 'react-redux';
import { getCenterPoint } from '../../../store/map.reducer.ts';
import { getGpxSegments } from '../../../store/gpxSegments.reducer.ts';
import { useEffect } from 'react';
import { SimpleGPX } from '../../../utils/SimpleGPX.ts';
import { CalculatedTrack, GpxSegment, State } from '../../../store/types.ts';

export function centerPointHook(
    map: L.Map,
    startZoom: number,
    selector: (state: State) => GpxSegment[] | CalculatedTrack[] = getGpxSegments
) {
    const centerPoint = useSelector(getCenterPoint);
    const gpxSegments = useSelector(selector);

    useEffect(() => {
        if (map && centerPoint) {
            map.setView(centerPoint, centerPoint.zoom);
        }
    }, [centerPoint]);

    useEffect(() => {
        if (map && gpxSegments.length > 0) {
            const firstSegment = SimpleGPX.fromString(gpxSegments[0].content);
            const { lat, lon } = firstSegment.tracks[0].points[0];
            map.setView({ lat, lng: lon }, startZoom);
        }
    }, [gpxSegments.length > 0]);
}
