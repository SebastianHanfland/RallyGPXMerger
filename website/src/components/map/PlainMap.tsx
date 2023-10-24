import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import L, { LayerGroup } from 'leaflet';
import { gpxSegmentDisplayHook } from './gpxSegmentsDisplayHook.ts';
import { calculatedTracksDisplayHook } from './calculatedTracksDisplayHook.ts';
import { trackMarkerDisplayHook } from './trackMarkerDisplayHook.ts';

const Munich = { name: 'München', lng: 11.581981, lat: 48.135125 };

interface Config {
    tileUrlTemplate: string;
    maxZoom?: number;
    minZoom?: number;
    zoomOffset?: number;
    startZoom: number;
}

const generalConfig: Config = {
    tileUrlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 20,
    minZoom: 2,
    zoomOffset: -1,
    startZoom: 10,
};

export function getMapConfiguration() {
    const { tileUrlTemplate, maxZoom, minZoom, zoomOffset, startZoom } = generalConfig;

    function getOptions() {
        return {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom,
            minZoom,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset,
        };
    }

    return { tileUrlTemplate, startZoom, getOptions };
}

let myMap: L.Map;

export const PlainMap = () => {
    const { tileUrlTemplate, startZoom, getOptions } = getMapConfiguration();

    useEffect(() => {
        if (!myMap) {
            myMap = L.map('mapid').setView(Munich, startZoom);
            L.tileLayer(tileUrlTemplate, getOptions()).addTo(myMap);
        }
    }, []);

    const gpxSegmentsLayer = useRef<LayerGroup>(null);
    const calculatedTracksLayer = useRef<LayerGroup>(null);
    const trackMarkerLayer = useRef<LayerGroup>(null);
    useEffect(() => {
        // @ts-ignore
        gpxSegmentsLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        calculatedTracksLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        trackMarkerLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    gpxSegmentDisplayHook(gpxSegmentsLayer);
    calculatedTracksDisplayHook(calculatedTracksLayer);
    trackMarkerDisplayHook(trackMarkerLayer);

    return (
        <div className={'m-1'}>
            <div id="mapid" style={{ height: '75vh', zIndex: 0 }} />
        </div>
    );
};
