import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import L, { LayerGroup, LeafletMouseEvent } from 'leaflet';
import { gpxSegmentDisplayHook } from './hooks/gpxSegmentsDisplayHook.ts';
import { calculatedTracksDisplayHook } from './hooks/calculatedTracksDisplayHook.ts';
import { trackMarkerDisplayHook } from './hooks/trackMarkerDisplayHook.ts';
import { blockedStreetsDisplayHook } from './hooks/blockedStreetsDisplayHook.ts';
import { centerPointHook } from './hooks/centerPointHook.tsx';
import { constructionsDisplayHook } from './hooks/constructionsDisplayHook.ts';
import { getMapConfiguration } from '../../common/mapConfig.ts';
import { Munich } from '../../common/locations.ts';
import { useDispatch } from 'react-redux';
import { pointsActions } from '../store/points.reducer.ts';

let myMap: L.Map | undefined;

export const PlainMap = () => {
    const dispatch = useDispatch();
    const { tileUrlTemplate, startZoom, getOptions } = getMapConfiguration();

    useEffect(() => {
        if (!myMap) {
            myMap = L.map('mapid').setView(Munich, startZoom);
            L.tileLayer(tileUrlTemplate, getOptions()).addTo(myMap);
            myMap.on('contextmenu', (event: LeafletMouseEvent) => {
                dispatch(pointsActions.setContextMenuPoint(event.latlng));
            });
        }
        return () => {
            myMap?.remove();
            myMap = undefined;
        };
    }, []);

    centerPointHook(myMap, startZoom);

    const gpxSegmentsLayer = useRef<LayerGroup>(null);
    const blockedStreetLayer = useRef<LayerGroup>(null);
    const calculatedTracksLayer = useRef<LayerGroup>(null);
    const trackMarkerLayer = useRef<LayerGroup>(null);
    const constructionsLayer = useRef<LayerGroup>(null);

    useEffect(() => {
        if (!myMap) {
            return;
        }
        // @ts-ignore
        gpxSegmentsLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        blockedStreetLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        calculatedTracksLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        trackMarkerLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        constructionsLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    blockedStreetsDisplayHook(blockedStreetLayer);
    calculatedTracksDisplayHook(calculatedTracksLayer);
    trackMarkerDisplayHook(trackMarkerLayer);
    constructionsDisplayHook(constructionsLayer);
    gpxSegmentDisplayHook(gpxSegmentsLayer);

    return (
        <div className={'m-1 shadow'}>
            <div id="mapid" style={{ height: '65vh', zIndex: 0 }} />
        </div>
    );
};
