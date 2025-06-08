import L from 'leaflet';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getParsedGpxSegments } from '../../new-store/segmentData.redux.ts';

export function centerPointHook(map: L.Map | undefined, startZoom: number) {
    const gpxSegments = useSelector(getParsedGpxSegments);

    useEffect(() => {
        if (map && gpxSegments.length > 0) {
            const { b, l } = gpxSegments[0].points[0];
            map.setView({ lat: b, lng: l }, startZoom);
        }
    }, [gpxSegments.length > 0]);
}
