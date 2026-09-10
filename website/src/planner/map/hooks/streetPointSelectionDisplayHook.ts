import { RefObject, useEffect, useMemo } from 'react';
import L, { LayerGroup } from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getParsedGpxSegments, getStreetLookup } from '../../store/segmentData.redux.ts';
import { getStreetPointSelection, mapActions } from '../../store/map.reducer.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getRoutePointReferences } from '../../logic/resolving/streets/streetRangeEditing.ts';
import { getStreetLookupIndex } from '../../logic/resolving/helper/getStreetLookupIndex.ts';
import { STREET_POINT_SELECTION } from '../panes.ts';

const SELECTABLE_POINT_COLOR = '#0d6efd';
const CURRENT_STREET_POINT_COLOR = '#00bfff';
const DISABLED_POINT_COLOR = '#808080';

function escapeTooltipText(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
        const escapedCharacters: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        return escapedCharacters[character]!;
    });
}

function getResolvedStreetName(
    index: number | undefined,
    streetLookup: Record<number, string | undefined>,
    unknown: string
): string {
    return index === undefined ? unknown : (streetLookup[index] ?? unknown);
}

function getStreetAssignmentTooltip(
    intl: ReturnType<typeof useIntl>,
    routeIndex: number,
    point: ReturnType<typeof getRoutePointReferences>[number]['point'],
    streetLookup: Record<number, string | undefined>
): string {
    const unknown = intl.formatMessage({ id: 'msg.unknown' });
    const rows = [
        intl.formatMessage({ id: 'msg.streetAssignment.point' }, { number: routeIndex + 1 }),
        intl.formatMessage(
            { id: 'msg.streetAssignment.raw' },
            { index: point.r ?? '—', name: getResolvedStreetName(point.r, streetLookup, unknown) }
        ),
        intl.formatMessage(
            { id: 'msg.streetAssignment.manual' },
            { index: point.m ?? '—', name: getResolvedStreetName(point.m, streetLookup, unknown) }
        ),
        intl.formatMessage(
            { id: 'msg.streetAssignment.smoothed' },
            { index: point.s, name: getResolvedStreetName(point.s, streetLookup, unknown) }
        ),
    ];
    return rows.map(escapeTooltipText).join('<br>');
}

function getSelectionRenderKey(
    selection: ReturnType<typeof getStreetPointSelection>,
    routePoints: ReturnType<typeof getRoutePointReferences>
): string {
    const selectionKey = selection
        ? [
              selection.trackId,
              selection.streetIndex,
              selection.boundary,
              selection.range.start,
              selection.range.end,
              selection.mode,
              selection.insertionIndex,
              selection.startRouteIndex,
              selection.selectedPoint?.segmentId,
              selection.selectedPoint?.pointIndex,
          ].join(':')
        : 'none';
    const routePointKey = routePoints
        .map(
            ({ segmentId, pointIndex, point }) =>
                `${segmentId}:${pointIndex}:${point.b}:${point.l}:${point.r}:${point.s}:${point.m}`
        )
        .join('|');
    return `${selectionKey}|${routePointKey}`;
}

export function streetPointSelectionDisplayHook(selectionLayer: RefObject<LayerGroup | null>) {
    const selection = useSelector(getStreetPointSelection);
    const track = useSelector(getTrackCompositions).find(({ id }) => id === selection?.trackId);
    const segments = useSelector(getParsedGpxSegments);
    const streetLookup = useSelector(getStreetLookup);
    const intl = useIntl();
    const dispatch = useDispatch();
    const routePoints = useMemo(() => (track ? getRoutePointReferences(track, segments) : []), [track, segments]);
    const selectionRenderKey = getSelectionRenderKey(selection, routePoints);

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
            const currentStreet = getStreetLookupIndex(point) === selection.streetIndex;
            const color = !selectable
                ? DISABLED_POINT_COLOR
                : currentStreet
                  ? CURRENT_STREET_POINT_COLOR
                  : SELECTABLE_POINT_COLOR;
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
            marker.bindTooltip(getStreetAssignmentTooltip(intl, routeIndex, point, streetLookup), { sticky: true });
            if (selectable) {
                marker.on('click', (event) => {
                    event.originalEvent?.stopPropagation();
                    dispatch(mapActions.setSelectedStreetPoint({ segmentId, pointIndex }));
                });
            }
            marker.addTo(current);
        });
    }, [dispatch, intl, routePoints, selection, selectionLayer, selectionRenderKey, streetLookup]);
}
