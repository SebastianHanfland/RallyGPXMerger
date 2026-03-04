import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import L, { LayerGroup } from 'leaflet';
import { comparisonTracksDisplayHook } from './comparisonTracksDisplayHook.ts';
import { snakeForComparisonMapHook } from './snakeForComparisonMapHook.ts';
import { getMapConfiguration } from '../../common/map/mapConfig.ts';
import { Munich } from '../../common/map/locations.ts';
import { constructionsForComparisonMapHook } from './constructionsForComparisonMapHook.ts';
import { useSelector } from 'react-redux';
import { getComparisonParsedTracks } from '../store/tracks.reducer.ts';
import { getCenterPoint } from '../../common/map/centerUtil.ts';

let myMap: L.Map;

export const ComparisonMap = () => {
    const { tileUrlTemplate, startZoom, getOptions } = getMapConfiguration();
    const parsedTracks = useSelector(getComparisonParsedTracks);

    useEffect(() => {
        if (!myMap) {
            myMap = L.map('mapid').setView(Munich, startZoom);
            L.tileLayer(tileUrlTemplate, getOptions()).addTo(myMap);
        }
    }, []);

    useEffect(() => {
        if (myMap) {
            const centerPoints = Object.values(parsedTracks).map((tracks) => getCenterPoint(tracks));
            let lat = 0;
            let lng = 0;
            console.log(centerPoints);
            centerPoints.forEach((point) => {
                lat += point.lat / centerPoints.length;
                lng += point.lng / centerPoints.length;
            });

            myMap.setView({ lat, lng }, startZoom);
        }
    }, [Object.keys(parsedTracks).length]);

    const trackLayer = useRef<LayerGroup>(null);
    const snakeLayer = useRef<LayerGroup>(null);
    const constructionLayer = useRef<LayerGroup>(null);

    useEffect(() => {
        // @ts-ignore
        trackLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        snakeLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        constructionLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    comparisonTracksDisplayHook(trackLayer);
    snakeForComparisonMapHook(snakeLayer);
    constructionsForComparisonMapHook(constructionLayer);

    return (
        <div>
            <div id="mapid" style={{ height: '85vh', zIndex: 0 }} />
        </div>
    );
};
