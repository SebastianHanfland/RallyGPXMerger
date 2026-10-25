import { useEffect, useRef } from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import L, { LayerGroup, LeafletMouseEvent } from 'leaflet';
import { gpxSegmentDisplayHook } from './hooks/gpxSegmentsDisplayHook';
import { calculatedTracksDisplayHook } from './hooks/calculatedTracksDisplayHook';
import { snakeForPlanningMapHook } from './hooks/snakeForPlanningMapHook';
import { blockedStreetsDisplayHook } from './hooks/blockedStreetsDisplayHook';
import { centerPointHook } from './hooks/centerPointHook';
import { constructionsDisplayHook } from './hooks/constructionsDisplayHook';
import { getMapConfiguration } from '../../common/map/mapConfig';
import { Munich } from '../../common/map/locations';
import { useDispatch, useSelector } from 'react-redux';
import { pointsActions } from '../store/points.reducer';
import { PointsOfInterestModal } from './points/PointsOfInterestModal';
import { pointsOfInterestDisplayHook } from './hooks/pointsOfInterestDisplayHook';
import { nodePointsDisplayHook } from './hooks/nodePointsDisplayHook';
import { GpxSegmentDialog } from './GpxSegmentDialog';
import { CreateBreakDialog } from '../break/CreateBreakDialog';
import { getIsSidebarOpen } from '../store/layout.reducer';
import { getParsedGpxSegments } from '../store/segmentData.redux';
import { getLatLng } from '../../utils/pointUtil';
import { EditBreakDialog } from '../break/EditBreakDialog';
import { EditNodeDialog } from '../nodes/EditNodeDialog';
import { moveCenterPointHook } from './hooks/moveCenterPointHook';
import { breakPointsDisplayHook } from './hooks/breakPointsDisplayHook';
import { CreateEntryPointDialog } from '../entry/CreateEntryPointDialog';
import { EditEntryPointDialog } from '../entry/EditEntryPointDialog';
import { entryPointsDisplayHook } from './hooks/entryPointsDisplayHook';
import { STREET_POINT_SELECTION, TRACK_MARKER } from './panes';
import { streetHighlightDisplayHook } from './hooks/streetHighlightDisplayHook';
import { streetPointSelectionDisplayHook } from './hooks/streetPointSelectionDisplayHook';
import { streetSelectionCompletionHook } from './hooks/streetSelectionCompletionHook';
import { StreetDialog } from './StreetDialog';

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
        if (gpxSegments.length >= 1 && myMap) {
            const lastSegment = gpxSegments[gpxSegments.length - 1];
            if (lastSegment.points.length > 0) {
                const point = lastSegment.points[0];
                const startPoint = getLatLng(point);
                myMap.setView(shiftStartPoint(startPoint, isSidebarOpen), startZoom);
            }
        }
    }, [gpxSegments.length]);

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
            myMap.createPane(TRACK_MARKER);
            const pane = myMap?.getPane(TRACK_MARKER)!;
            pane.style.zIndex = '1000';
            myMap.createPane(STREET_POINT_SELECTION);
            const streetPointSelectionPane = myMap.getPane(STREET_POINT_SELECTION)!;
            streetPointSelectionPane.style.zIndex = '1100';
        }
        return () => {
            myMap?.remove();
            myMap = undefined;
        };
    }, []);

    centerPointHook(myMap, startZoom);
    moveCenterPointHook(myMap);

    const gpxSegmentsLayer = useRef<LayerGroup>(null);
    const blockedStreetLayer = useRef<LayerGroup>(null);
    const calculatedTracksLayer = useRef<LayerGroup>(null);
    const snakeLayer = useRef<LayerGroup>(null);
    const constructionsLayer = useRef<LayerGroup>(null);
    const pointsOfInterestLayer = useRef<LayerGroup>(null);
    const nodePointsLayer = useRef<LayerGroup>(null);
    const breakPointsLayer = useRef<LayerGroup>(null);
    const entryPointsLayer = useRef<LayerGroup>(null);
    const streetHighlightLayer = useRef<LayerGroup>(null);
    const streetPointSelectionLayer = useRef<LayerGroup>(null);

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
        // @ts-ignore
        breakPointsLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        entryPointsLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        streetHighlightLayer.current = L.layerGroup().addTo(myMap);
        // @ts-ignore
        streetPointSelectionLayer.current = L.layerGroup().addTo(myMap);
    }, []);

    blockedStreetsDisplayHook(blockedStreetLayer);
    calculatedTracksDisplayHook(calculatedTracksLayer);
    snakeForPlanningMapHook(snakeLayer);
    constructionsDisplayHook(constructionsLayer);
    pointsOfInterestDisplayHook(pointsOfInterestLayer);
    breakPointsDisplayHook(breakPointsLayer);
    entryPointsDisplayHook(entryPointsLayer);
    nodePointsDisplayHook(nodePointsLayer);
    gpxSegmentDisplayHook(gpxSegmentsLayer);
    streetHighlightDisplayHook(streetHighlightLayer);
    streetPointSelectionDisplayHook(streetPointSelectionLayer);
    streetSelectionCompletionHook();

    return (
        <div>
            <div id="mapid" style={{ height: '100vh', zIndex: 0 }} />
            <PointsOfInterestModal />
            <GpxSegmentDialog />
            <StreetDialog />
            <CreateBreakDialog />
            <EditBreakDialog />
            <EditNodeDialog />
            <CreateEntryPointDialog />
            <EditEntryPointDialog />
        </div>
    );
};
