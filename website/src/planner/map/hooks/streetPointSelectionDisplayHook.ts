import { RefObject, useEffect, useMemo } from 'react';
import L, { LayerGroup } from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { getStreetPointSelection, mapActions } from '../../store/map.reducer.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getRoutePointReferences } from '../../logic/resolving/streets/streetRangeEditing.ts';
import { STREET_POINT_SELECTION } from '../panes.ts';

const SELECTABLE_POINT_COLOR = '#198754';
const DISABLED_POINT_COLOR = '#808080';

export function streetPointSelectionDisplayHook(selectionLayer: RefObject<LayerGroup | null>) {
    const selection = useSelector(getStreetPointSelection);
    const track = useSelector(getTrackCompositions).find(({ id }) => id === selection?.trackId);
    const segments = useSelector(getParsedGpxSegments);
    const dispatch = useDispatch();
    const routePoints = useMemo(() => (track ? getRoutePointReferences(track, segments) : []), [track, segments]);

    useEffect(() => {
        const current = selectionLayer.current;
        if (!current) return;
        current.clearLayers();
        if (!selection) return;
        if (!track || routePoints.length === 0) return;
        if (
            selection.range.start < 0 ||
            selection.range.end < selection.range.start ||
            selection.range.start >= routePoints.length ||
            selection.range.end >= routePoints.length
        ) {
            return;
        }

        routePoints.forEach(({ point, segmentId, pointIndex }, routeIndex) => {
            if (!Number.isFinite(point.b) || !Number.isFinite(point.l)) return;
            const selectable =
                selection.boundary === 'start'
                    ? routeIndex <= selection.range.end
                    : routeIndex >= selection.range.start;
            const color = selectable ? SELECTABLE_POINT_COLOR : DISABLED_POINT_COLOR;
            const marker = L.circleMarker(
                { lat: point.b, lng: point.l },
                {
                    color,
                    fillColor: color,
                    fillOpacity: 1,
                    pane: STREET_POINT_SELECTION,
                    radius: 10,
                    weight: 1,
                    interactive: selectable,
                }
            );
            marker.bindTooltip(`${routeIndex + 1}`, { sticky: true });
            if (selectable) {
                marker.on('click', (event) => {
                    event.originalEvent?.stopPropagation();
                    dispatch(mapActions.setSelectedStreetPoint({ segmentId, pointIndex }));
                });
            }
            marker.addTo(current);
        });
    }, [dispatch, routePoints, selection, selectionLayer]);
}
