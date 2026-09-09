import { StreetPointSelection, TrackComposition } from '../store/types.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { mapActions } from '../store/map.reducer.ts';
import {
    getNewStreetRangeAssignments,
    getRoutePointReferences,
    getStreetRange,
    getStreetRangeAssignments,
} from '../logic/resolving/streets/streetRangeEditing.ts';
import { WayPoint } from '../logic/resolving/types.ts';
import { enrichStreetWithPostCodeAndDistrict } from '../logic/resolving/streets/enrichWithPostCodeAndDistrict.ts';

export function getStreetPath(waypoint: WayPoint) {
    return (
        waypoint.path ?? [
            { lat: waypoint.pointFrom.lat, lon: waypoint.pointFrom.lon, s: waypoint.s },
            { lat: waypoint.pointTo.lat, lon: waypoint.pointTo.lon, s: waypoint.s },
        ]
    );
}

export function beginStreetBoundaryEdit(
    dispatch: AppDispatch,
    track: TrackComposition,
    routePoints: ReturnType<typeof getRoutePointReferences>,
    waypoint: WayPoint,
    boundary: 'start' | 'end'
) {
    const streetIndex = waypoint.s;
    if (streetIndex === undefined || routePoints.length === 0) return false;
    const range = getStreetRange(routePoints, streetIndex);
    if (!range || range.start < 0 || range.end < range.start || range.end >= routePoints.length) return false;
    dispatch(mapActions.setHighlightedStreetPath(getStreetPath(waypoint)));
    dispatch(mapActions.setPointToCenter({ lat: waypoint.pointFrom.lat, lng: waypoint.pointFrom.lon }));
    dispatch(mapActions.setStreetPointSelection({ trackId: track.id, streetIndex, boundary, range }));
    return true;
}

export function beginNewStreet(
    dispatch: AppDispatch,
    nextStreetLookupIndex: number,
    track: TrackComposition,
    routePoints: ReturnType<typeof getRoutePointReferences>,
    insertionIndex: number
) {
    if (routePoints.length === 0) return false;
    const streetIndex = nextStreetLookupIndex + 1;
    dispatch(segmentDataActions.addStreetLookup({ [streetIndex]: undefined }));
    dispatch(segmentDataActions.addPostCodeLookup({ [streetIndex]: undefined }));
    dispatch(segmentDataActions.addDistrictLookup({ [streetIndex]: undefined }));
    dispatch(
        mapActions.setStreetPointSelection({
            trackId: track.id,
            streetIndex,
            boundary: 'start',
            range: { start: 0, end: routePoints.length - 1 },
            mode: 'add-start',
            insertionIndex,
        })
    );
    return true;
}

export function applyStreetSelection(
    dispatch: AppDispatch,
    selection: StreetPointSelection,
    routePoints: ReturnType<typeof getRoutePointReferences>,
    selectedRouteIndex: number
) {
    if (selection.mode === 'add-start') {
        dispatch(
            mapActions.setStreetPointSelection({
                ...selection,
                boundary: 'end',
                mode: 'add-end',
                range: { start: selectedRouteIndex, end: routePoints.length - 1 },
                startRouteIndex: selectedRouteIndex,
                selectedPoint: undefined,
            })
        );
        return;
    }
    if (selection.mode === 'add-end') {
        if (selection.startRouteIndex === undefined || selectedRouteIndex < selection.startRouteIndex) return;
        dispatch(
            segmentDataActions.applyStreetRangeAssignments(
                getNewStreetRangeAssignments(
                    routePoints,
                    selection.streetIndex,
                    selection.startRouteIndex,
                    selectedRouteIndex
                )
            )
        );
        dispatch(enrichStreetWithPostCodeAndDistrict(selection.streetIndex));
        dispatch(mapActions.setHighlightedStreetPath(undefined));
        dispatch(mapActions.setStreetPointSelection(undefined));
        return;
    }
    dispatch(
        segmentDataActions.applyStreetRangeAssignments(
            getStreetRangeAssignments(
                routePoints,
                selection.streetIndex,
                selection.range,
                selection.boundary,
                selectedRouteIndex
            )
        )
    );
    dispatch(mapActions.setHighlightedStreetPath(undefined));
    dispatch(mapActions.setStreetPointSelection(undefined));
}
