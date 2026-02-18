import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import L, { LayerGroup, LeafletMouseEvent } from 'leaflet';
import { gpxSegmentDisplayHook } from './hooks/gpxSegmentsDisplayHook.ts';
import { calculatedTracksDisplayHook } from './hooks/calculatedTracksDisplayHook.ts';
import { snakeForPlanningMapHook } from './hooks/snakeForPlanningMapHook.ts';
import { blockedStreetsDisplayHook } from './hooks/blockedStreetsDisplayHook.ts';
import { centerPointHook } from './hooks/centerPointHook.tsx';
import { constructionsDisplayHook } from './hooks/constructionsDisplayHook.ts';
import { getMapConfiguration } from '../../common/mapConfig.ts';
import { Munich } from '../../common/locations.ts';
import { useDispatch, useSelector } from 'react-redux';
import { pointsActions } from '../store/points.reducer.ts';
import { PointsOfInterestModal } from './points/PointsOfInterestModal.tsx';
import { pointsOfInterestDisplayHook } from './hooks/pointsOfInterestDisplayHook.ts';
import { nodePointsDisplayHook } from './hooks/nodePointsDisplayHook.ts';
import { GpxSegmentDialog } from './GpxSegmentDialog.tsx';
import { CreateBreakDialog } from './CreateBreakDialog.tsx';
import { getIsSidebarOpen } from '../store/layout.reducer.ts';
import { getParsedGpxSegments } from '../store/segmentData.redux.ts';
import { getLatLng } from '../../utils/pointUtil.ts';
import { EditBreakDialog } from './EditBreakDialog.tsx';
import { EditNodeDialog } from '../nodes/EditNodeDialog.tsx';

let myMap: L.Map | undefined;

const shiftStartPoint = (point: { lat: number; lng: number }, sideBarOpen: boolean): { lat: number; lng: number } => {
    if (!sideBarOpen) {
        return point;
    }
    return { ...point, lng: point.lng + 0.25 };
};

export const InteractionMap = () => {
    const dispatch = useDispatch();
    const { tileUrlTemplate, startZoom, getOptions } = getMapConfiguration();
    const gpxSegments = useSelector(getParsedGpxSegments);
    const isSidebarOpen = useSelector(getIsSidebarOpen);

    useEffect(() => {
        if (gpxSegments.length > 1 && myMap) {
            const lastSegment = gpxSegments[gpxSegments.length - 1];
            if (lastSegment.points.length > 0) {
                const point = lastSegment.points[0];
                const startPoint = getLatLng(point);
                myMap.setView(shiftStartPoint(startPoint, isSidebarOpen), startZoom);
            }
        }
    }, []);

    useEffect(() => {
        if (!myMap) {
            const startPoint = gpxSegments.length > 0 ? getLatLng(gpxSegments[0].points[0]) : Munich;
            myMap = L.map('mapid').setView(shiftStartPoint(startPoint, isSidebarOpen), startZoom);
            L.tileLayer(tileUrlTemplate, getOptions()).addTo(myMap);
            myMap.on('contextmenu', (event: LeafletMouseEvent) => {
                dispatch(pointsActions.setContextMenuPoint({ lat: event.latlng.lat, lng: event.latlng.lng }));
            });
            myMap.on('click', (event: LeafletMouseEvent) => {
                console.log(event);
                // dispatch(pointsActions.setContextMenuPoint({ lat: event.latlng.lat, lng: event.latlng.lng }));
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
    const snakeLayer = useRef<LayerGroup>(null);
    const constructionsLayer = useRef<LayerGroup>(null);
    const pointsOfInterestLayer = useRef<LayerGroup>(null);
    const nodePointsLayer = useRef<LayerGroup>(null);

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
        snakeLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        constructionsLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        pointsOfInterestLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        nodePointsLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    blockedStreetsDisplayHook(blockedStreetLayer);
    calculatedTracksDisplayHook(calculatedTracksLayer);
    snakeForPlanningMapHook(snakeLayer);
    constructionsDisplayHook(constructionsLayer);
    pointsOfInterestDisplayHook(pointsOfInterestLayer);
    nodePointsDisplayHook(nodePointsLayer);
    gpxSegmentDisplayHook(gpxSegmentsLayer);

    return (
        <div>
            <div id="mapid" style={{ height: '100vh', zIndex: 0 }} />
            <PointsOfInterestModal />
            <GpxSegmentDialog />
            <CreateBreakDialog />
            <EditBreakDialog />
            <EditNodeDialog />
        </div>
    );
};
