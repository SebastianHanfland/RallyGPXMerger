import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet.locatecontrol'; // Import plugin
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'; // Import styles
import L, { LayerGroup } from 'leaflet';
import { tracksForDisplayMapHook } from './tracksForDisplayMapHook.ts';
import { snakeForDisplayMapHook } from './snakeForDisplayMapHook.ts';
import { getMapConfiguration } from '../../common/mapConfig.ts';
import { useDispatch, useSelector } from 'react-redux';
import { getIsLive, mapActions } from '../store/map.reducer.ts';
import { criticalMapsHook } from '../criticalmaps/criticalMapsHook.ts';
import { getParsedTracks } from '../store/displayTracksReducer.ts';
import { toLatLng } from '../../utils/pointUtil.ts';
import { Munich } from '../../common/locations.ts';
import { ParsedTrack } from '../../common/types.ts';

let myMap: L.Map;

export const isInIframe = window.location.search.includes('&iframe');

function getCenterPoint(parsedTracks: ParsedTrack[] | undefined) {
    if (!parsedTracks || parsedTracks.length === 0) {
        return Munich;
    }
    const point = parsedTracks[0].points[parsedTracks[0].points.length - 1];
    return toLatLng(point);
}

export const PresentationMap = () => {
    const { tileUrlTemplate, getOptions } = getMapConfiguration();
    const dispatch = useDispatch();
    const parsedTracks = useSelector(getParsedTracks);
    const isLive = useSelector(getIsLive);

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
            const centerPoint = getCenterPoint(parsedTracks);
            myMap.setView(centerPoint, 12);
        }
    }, []);

    const trackLayer = useRef<LayerGroup>(null);
    const snakeLayer = useRef<LayerGroup>(null);
    const criticalMapsLayer = useRef<LayerGroup>(null);

    useEffect(() => {
        // @ts-ignore
        trackLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        snakeLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        criticalMapsLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    tracksForDisplayMapHook(trackLayer);
    snakeForDisplayMapHook(snakeLayer);
    criticalMapsHook(criticalMapsLayer);

    return (
        <div onMouseLeave={() => dispatch(mapActions.setHighlightedTrack())}>
            <div id="mapid" style={{ height: '100vh', zIndex: 0 }} />
        </div>
    );
};
