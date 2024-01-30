import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import L, { LayerGroup } from 'leaflet';
import { zipTracksDisplayHook } from '../components/map/hooks/zipTracksDisplayHook.ts';
import { zipTrackMarkerDisplayHook } from '../components/map/hooks/zipTrackMarkerDisplayHook.ts';
import { getMapConfiguration } from '../common/mapConfig.ts';

const Munich = { name: 'München', lng: 11.581981, lat: 48.135125 };

let myMap: L.Map;

export const DisplayMap = () => {
    const { tileUrlTemplate, startZoom, getOptions } = getMapConfiguration();

    useEffect(() => {
        if (!myMap) {
            myMap = L.map('mapid').setView(Munich, startZoom);
            L.tileLayer(tileUrlTemplate, getOptions()).addTo(myMap);
        }
    }, []);

    const zipTracksLayer = useRef<LayerGroup>(null);
    const tracksLayer = useRef<LayerGroup>(null);

    useEffect(() => {
        // @ts-ignore
        zipTracksLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        tracksLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    zipTracksDisplayHook(zipTracksLayer);
    zipTrackMarkerDisplayHook(tracksLayer);

    return (
        <div>
            <div id="mapid" style={{ height: '85vh', zIndex: 0 }} />
        </div>
    );
};
