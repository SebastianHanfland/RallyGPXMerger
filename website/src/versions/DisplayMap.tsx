import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import L, { LayerGroup } from 'leaflet';
import { calculatedTracksDisplayHook } from '../components/map/hooks/calculatedTracksDisplayHook.ts';
import { centerPointHook } from '../components/map/hooks/centerPointHook.tsx';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { getMapConfiguration } from '../components/map/PlainMap.tsx';

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

    centerPointHook(myMap, startZoom, getCalculatedTracks);

    const calculatedTracksLayer = useRef<LayerGroup>(null);

    useEffect(() => {
        // @ts-ignore
        calculatedTracksLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    calculatedTracksDisplayHook(calculatedTracksLayer);

    return (
        <div>
            <div id="mapid" style={{ height: '90vh', zIndex: 0 }} />
        </div>
    );
};
