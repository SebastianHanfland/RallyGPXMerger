import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import { LocateControl } from 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'; // Import styles
import L, { LayerGroup } from 'leaflet';
import { tracksForDisplayMapHook } from './tracksForDisplayMapHook.ts';
import { snakeForDisplayMapHook } from './snakeForDisplayMapHook.ts';
import { getMapConfiguration } from '../../common/map/mapConfig.ts';
import { useDispatch, useSelector } from 'react-redux';
import { displayMapActions, getIsLive } from '../store/displayMapReducer.ts';
import { criticalMapsHook } from '../criticalmaps/criticalMapsHook.ts';
import { getLatLng } from '../../utils/pointUtil.ts';
import { Munich } from '../../common/map/locations.ts';
import { CalculatedTrack } from '../../common/types.ts';
import { getDisplayTracks } from '../store/displayTracksReducer.ts';
import { breaksForDisplayMapHook } from './breaksForDisplayMapHook.ts';

let myMap: L.Map;

export const isInIframe = window.location.search.includes('&iframe');

function getCenterPoint(parsedTracks: CalculatedTrack[] | undefined): { lat: number; lng: number } {
    if (!parsedTracks || parsedTracks.length === 0) {
        return Munich;
    }
    const point = parsedTracks[0].points[parsedTracks[0].points.length - 1];
    return getLatLng(point);
}

export const PresentationMap = () => {
    const { tileUrlTemplate, getOptions } = getMapConfiguration();
    const dispatch = useDispatch();
    const parsedTracks = useSelector(getDisplayTracks);
    const isLive = useSelector(getIsLive);

    useEffect(() => {
        if (!myMap) {
            const noSingleScroll = { tap: !L.Browser.mobile, dragging: !L.Browser.mobile };
            myMap = L.map('mapid', isInIframe ? noSingleScroll : undefined);

            L.tileLayer(tileUrlTemplate, getOptions()).addTo(myMap);
            if (isLive && L.Browser.mobile && !isInIframe) {
                const locate = new LocateControl({ initialZoomLevel: 12 });
                locate.addTo(myMap);
                locate.start();
            }
            const centerPoint = getCenterPoint(parsedTracks);
            myMap.setView(centerPoint, 12);
        }
    }, []);

    const breakLayer = useRef<LayerGroup>(null);
    const trackLayer = useRef<LayerGroup>(null);
    const snakeLayer = useRef<LayerGroup>(null);
    const criticalMapsLayer = useRef<LayerGroup>(null);

    useEffect(() => {
        // @ts-ignore
        breakLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        trackLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        snakeLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        criticalMapsLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    tracksForDisplayMapHook(trackLayer);
    breaksForDisplayMapHook(breakLayer);
    snakeForDisplayMapHook(snakeLayer);
    criticalMapsHook(criticalMapsLayer);

    return (
        <div onMouseLeave={() => dispatch(displayMapActions.setHighlightedTrack())}>
            <div id="mapid" style={{ height: '100vh', zIndex: 0, width: '100vw' }} />
        </div>
    );
};
