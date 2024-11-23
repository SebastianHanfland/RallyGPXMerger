import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet.locatecontrol'; // Import plugin
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'; // Import styles
import L, { LayerGroup } from 'leaflet';
import { zipTracksDisplayHook } from './zipTracksDisplayHook.ts';
import { zipTrackMarkerDisplayHook } from './zipTrackMarkerDisplayHook.ts';
import { getMapConfiguration } from '../../common/mapConfig.ts';
import { useDispatch, useSelector } from 'react-redux';
import { getIsLive, mapActions } from '../store/map.reducer.ts';
import { criticalMapsHook } from '../criticalmaps/criticalMapsHook.ts';
import { getZipTracks } from '../store/zipTracks.reducer.ts';
import { getGpx } from '../../common/cache/gpxCache.ts';
import { toLatLng } from '../../utils/pointUtil.ts';
import { Munich } from '../../common/locations.ts';
import { ZipTrack } from '../../common/types.ts';

let myMap: L.Map;

export const isInIframe = window.location.search.includes('&iframe');

function getCenterPoint(currentZipTracks: ZipTrack[] | undefined) {
    if (!currentZipTracks || !currentZipTracks[0]) {
        return Munich;
    }
    const gpx = getGpx(currentZipTracks[0]);
    const point = gpx.tracks[gpx.tracks.length - 1].points[gpx.tracks[gpx.tracks.length - 1].points.length - 1];
    return toLatLng(point);
}

export const PresentationMap = () => {
    const { tileUrlTemplate, getOptions } = getMapConfiguration();
    const dispatch = useDispatch();
    const zipTracks = useSelector(getZipTracks);
    const isLive = useSelector(getIsLive);
    const currentZipTracks = zipTracks ? Object.values(zipTracks)[0] : undefined;

    useEffect(() => {
        if (!myMap) {
            const noSingleScroll = { tap: !L.Browser.mobile, dragging: !L.Browser.mobile };
            myMap = L.map('mapid', isInIframe ? noSingleScroll : undefined);
            L.tileLayer(tileUrlTemplate, getOptions()).addTo(myMap);
            if (isLive && L.Browser.mobile && !isInIframe) {
                const locate = L.control.locate({ initialZoomLevel: 12 });
                locate.addTo(myMap);
                locate.start();
            }
            const centerPoint = getCenterPoint(currentZipTracks);
            myMap.setView(centerPoint, 12);
        }
    }, []);

    const zipTracksLayer = useRef<LayerGroup>(null);
    const tracksLayer = useRef<LayerGroup>(null);
    const criticalMapsLayer = useRef<LayerGroup>(null);

    useEffect(() => {
        // @ts-ignore
        zipTracksLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        tracksLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        criticalMapsLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    zipTracksDisplayHook(zipTracksLayer, true);
    zipTrackMarkerDisplayHook(tracksLayer);
    criticalMapsHook(criticalMapsLayer);

    return (
        <div onMouseLeave={() => dispatch(mapActions.setHighlightedTrack())}>
            <div id="mapid" style={{ height: '100vh', zIndex: 0 }} />
        </div>
    );
};
