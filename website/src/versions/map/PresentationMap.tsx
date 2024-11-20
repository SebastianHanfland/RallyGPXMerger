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
import { mapActions } from '../store/map.reducer.ts';
import { criticalMapsHook } from '../criticalmaps/criticalMapsHook.ts';
import { isLive } from '../ZipTimeSlider.tsx';
import { getZipTracks } from '../store/zipTracks.reducer.ts';
import { getGpx } from '../../common/cache/gpxCache.ts';
import { toLatLng } from '../../utils/pointUtil.ts';
import { Munich } from '../../common/locations.ts';

let myMap: L.Map;

export const isInIframe = window.location.search.includes('&iframe');

export const PresentationMap = () => {
    const { tileUrlTemplate, getOptions } = getMapConfiguration();
    const dispatch = useDispatch();
    const zipTracks = useSelector(getZipTracks);
    const currentZipTracks = zipTracks ? Object.values(zipTracks)[0] : undefined;
    const centerPoint =
        currentZipTracks && currentZipTracks[0] ? toLatLng(getGpx(currentZipTracks[0]).tracks[0].points[0]) : Munich;

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
        }
    }, []);

    useEffect(() => {
        if (myMap && centerPoint) {
            myMap.setView(centerPoint, 12);
        }
    }, [centerPoint]);

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
