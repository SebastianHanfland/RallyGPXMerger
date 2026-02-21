import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import L, { LayerGroup } from 'leaflet';
import { comparisonTracksDisplayHook } from './comparisonTracksDisplayHook.ts';
import { snakeForDisplayMapHook } from './snakeForDisplayMapHook.ts';
import { getMapConfiguration } from '../../common/map/mapConfig.ts';
import { Munich } from '../../common/map/locations.ts';

let myMap: L.Map;

export const ComparisonMap = () => {
    const { tileUrlTemplate, startZoom, getOptions } = getMapConfiguration();

    useEffect(() => {
        if (!myMap) {
            myMap = L.map('mapid').setView(Munich, startZoom);
            L.tileLayer(tileUrlTemplate, getOptions()).addTo(myMap);
        }
    }, []);

    const trackLayer = useRef<LayerGroup>(null);
    const snakeLayer = useRef<LayerGroup>(null);

    useEffect(() => {
        // @ts-ignore
        trackLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        snakeLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    comparisonTracksDisplayHook(trackLayer);
    snakeForDisplayMapHook(snakeLayer);

    return (
        <div>
            <div id="mapid" style={{ height: '85vh', zIndex: 0 }} />
        </div>
    );
};
