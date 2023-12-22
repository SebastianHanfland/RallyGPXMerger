import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import L, { LayerGroup } from 'leaflet';
import { getMapConfiguration } from '../components/map/PlainMap.tsx';
import { zipTracksDisplayHook } from '../components/map/hooks/zipTracksDisplayHook.ts';

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

    const calculatedTracksLayer = useRef<LayerGroup>(null);

    useEffect(() => {
        // @ts-ignore
        calculatedTracksLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    zipTracksDisplayHook(calculatedTracksLayer);

    return (
        <div>
            <div id="mapid" style={{ height: '90vh', zIndex: 0 }} />
        </div>
    );
};
