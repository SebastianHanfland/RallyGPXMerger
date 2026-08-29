import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import { EditIcon } from '../../../../utils/icons/EditIcon.tsx';
import { CancelIcon } from '../../../../utils/icons/CancelIcon.tsx';
import { GeoLinkIcon } from '../../../../utils/icons/GeoLinkIcon.tsx';
import { formatNumber } from '../../../../utils/numberUtil.ts';
import { TrackComposition } from '../../../store/types.ts';
import { TrackWayPointType } from '../../../logic/resolving/types.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { getParsedGpxSegments, segmentDataActions } from '../../../store/segmentData.redux.ts';
import { getNextStreetLookupIndex } from '../../../store/segmentData.redux.ts';
import { getStreetPointSelection, mapActions } from '../../../store/map.reducer.ts';
import {
    getRoutePointReferences,
    getNewStreetRangeAssignments,
    getStreetRange,
    getStreetRangeAssignments,
} from '../../../logic/resolving/streets/streetRangeEditing.ts';

interface Props {
    track: TrackComposition;
}
export const PlannerSidebarTrackStreets = ({ track }: Props) => {
    const trackStreetInfo = useSelector(getTrackStreetInfos).find((trackInfo) => trackInfo.id === track.id);
    const parsedSegments = useSelector(getParsedGpxSegments);
    const dispatch = useDispatch();
    const intl = useIntl();
    const selection = useSelector(getStreetPointSelection);
    const routePoints = useMemo(() => getRoutePointReferences(track, parsedSegments), [track, parsedSegments]);
    const nextStreetLookupIndex = useSelector(getNextStreetLookupIndex);
    const tableRef = useRef<HTMLTableElement>(null);
    const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
    const [insertionPositions, setInsertionPositions] = useState<number[]>([0]);
    const getStreetPath = (wayPoint: NonNullable<typeof trackStreetInfo>['wayPoints'][number]) =>
        wayPoint.path ?? [
            { lat: wayPoint.pointFrom.lat, lon: wayPoint.pointFrom.lon, s: wayPoint.s },
            { lat: wayPoint.pointTo.lat, lon: wayPoint.pointTo.lon, s: wayPoint.s },
        ];
    const highlightStreetPath = (wayPoint: NonNullable<typeof trackStreetInfo>['wayPoints'][number]) =>
        dispatch(mapActions.setHighlightedStreetPath(getStreetPath(wayPoint)));
    const centerPoint = (lat: number, lon: number) => dispatch(mapActions.setPointToCenter({ lat, lng: lon }));
    const openSelection = (
        wayPoint: NonNullable<typeof trackStreetInfo>['wayPoints'][number],
        boundary: 'start' | 'end'
    ) => {
        const streetIndex = wayPoint.s;
        if (streetIndex === undefined) return;
        if (routePoints.length === 0) return;
        const range = getStreetRange(routePoints, streetIndex);
        if (range && range.start >= 0 && range.end >= range.start && range.end < routePoints.length) {
            highlightStreetPath(wayPoint);
            centerPoint(wayPoint.pointFrom.lat, wayPoint.pointFrom.lon);
            dispatch(
                mapActions.setStreetPointSelection({
                    trackId: track.id,
                    streetIndex,
                    boundary,
                    range,
                })
            );
        }
    };
    const startNewStreet = (insertionIndex: number) => {
        if (routePoints.length === 0) return;
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
    };
    useEffect(() => {
        if (!selection?.selectedPoint || selection.trackId !== track.id) return;
        const selectedRouteIndex = routePoints.findIndex(
            ({ segmentId, pointIndex }) =>
                segmentId === selection.selectedPoint?.segmentId && pointIndex === selection.selectedPoint?.pointIndex
        );
        if (selectedRouteIndex < 0) return;
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
        dispatch(mapActions.setStreetPointSelection(undefined));
    }, [dispatch, routePoints, selection, track.id]);
    useEffect(
        () => () => {
            dispatch(mapActions.setHighlightedStreetPath(undefined));
            dispatch(mapActions.setStreetPointSelection(undefined));
        },
        [dispatch]
    );
    const streets = trackStreetInfo?.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Track) ?? [];
    useLayoutEffect(() => {
        const table = tableRef.current;
        if (!table) return;
        const updatePositions = () => {
            const tableTop = table.getBoundingClientRect().top;
            const rows = rowRefs.current
                .slice(0, streets.length)
                .filter((row): row is HTMLTableRowElement => row !== null);
            if (rows.length === 0) {
                setInsertionPositions([(table.tHead?.getBoundingClientRect().bottom ?? tableTop) - tableTop]);
                return;
            }
            setInsertionPositions([
                ...rows.map((row) => row.getBoundingClientRect().top - tableTop),
                rows[rows.length - 1]!.getBoundingClientRect().bottom - tableTop,
            ]);
        };
        updatePositions();
        window.addEventListener('resize', updatePositions);
        if (typeof ResizeObserver === 'undefined') {
            return () => window.removeEventListener('resize', updatePositions);
        }
        const observer = new ResizeObserver(updatePositions);
        observer.observe(table);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updatePositions);
        };
    }, [streets.length]);
    return (
        <>
            <div className={'position-relative'} style={{ paddingLeft: '2.5rem' }}>
                <div
                    data-testid={'street-insertion-rail'}
                    className={'position-absolute'}
                    style={{ left: 0, top: 0, bottom: 0, width: '2.5rem' }}
                >
                    {insertionPositions.map((position, insertionIndex) => {
                        const active =
                            selection?.trackId === track.id &&
                            selection.mode?.startsWith('add-') &&
                            selection.insertionIndex === insertionIndex;
                        return (
                            <Button
                                key={insertionIndex}
                                type={'button'}
                                variant={'outline-secondary'}
                                size={'sm'}
                                title={intl.formatMessage({
                                    id: active ? 'msg.cancelAddStreet' : 'msg.addStreet',
                                })}
                                aria-label={intl.formatMessage({
                                    id: active ? 'msg.cancelAddStreet' : 'msg.addStreet',
                                })}
                                onClick={() =>
                                    active
                                        ? dispatch(mapActions.setStreetPointSelection(undefined))
                                        : startNewStreet(insertionIndex)
                                }
                                className={'p-0'}
                                style={{
                                    position: 'absolute',
                                    left: '0.25rem',
                                    top: `${position}px`,
                                    transform: 'translateY(-50%)',
                                    width: '2rem',
                                    height: '2rem',
                                    lineHeight: 1,
                                    borderRadius: '0.25rem',
                                }}
                            >
                                {active ? <CancelIcon /> : '+'}
                            </Button>
                        );
                    })}
                </div>
                <Table ref={tableRef} data-testid={'track-street-list'} size={'sm'} striped hover>
                    <thead>
                        <tr>
                            <th>
                                <FormattedMessage id={'msg.start'} />
                            </th>
                            <th>
                                <FormattedMessage id={'msg.end'} />
                            </th>
                            <th>
                                <FormattedMessage id={'msg.street'} />
                            </th>
                            <th>
                                <FormattedMessage id={'msg.length'} />
                            </th>
                            <th>
                                <FormattedMessage id={'msg.streetPoints'} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {streets.map((wayPoint, index) => (
                            <tr
                                ref={(row) => {
                                    rowRefs.current[index] = row;
                                }}
                                key={`${wayPoint.s ?? 'street'}-${index}`}
                            >
                                {/** The active boundary is identified by the effective street index and boundary. */}
                                {(() => {
                                    const editingStart =
                                        selection?.trackId === track.id &&
                                        selection.boundary === 'start' &&
                                        selection.streetIndex === wayPoint.s;
                                    const editingEnd =
                                        selection?.trackId === track.id &&
                                        selection.boundary === 'end' &&
                                        selection.streetIndex === wayPoint.s;
                                    return (
                                        <>
                                            <td>
                                                <Button
                                                    type={'button'}
                                                    variant={'link'}
                                                    size={'sm'}
                                                    title={intl.formatMessage({ id: 'msg.goToStart' })}
                                                    aria-label={intl.formatMessage({ id: 'msg.goToStart' })}
                                                    onClick={() => {
                                                        highlightStreetPath(wayPoint);
                                                        centerPoint(wayPoint.pointFrom.lat, wayPoint.pointFrom.lon);
                                                    }}
                                                >
                                                    <GeoLinkIcon />
                                                </Button>
                                                <Button
                                                    type={'button'}
                                                    variant={'link'}
                                                    size={'sm'}
                                                    title={intl.formatMessage({
                                                        id: editingStart
                                                            ? 'msg.cancelStreetStartEdit'
                                                            : 'msg.editStreetStart',
                                                    })}
                                                    aria-label={intl.formatMessage({
                                                        id: editingStart
                                                            ? 'msg.cancelStreetStartEdit'
                                                            : 'msg.editStreetStart',
                                                    })}
                                                    onClick={() =>
                                                        editingStart
                                                            ? dispatch(mapActions.setStreetPointSelection(undefined))
                                                            : openSelection(wayPoint, 'start')
                                                    }
                                                >
                                                    {editingStart ? <CancelIcon /> : <EditIcon />}
                                                </Button>
                                            </td>
                                            <td>
                                                <Button
                                                    type={'button'}
                                                    variant={'link'}
                                                    size={'sm'}
                                                    title={intl.formatMessage({ id: 'msg.goToEnd' })}
                                                    aria-label={intl.formatMessage({ id: 'msg.goToEnd' })}
                                                    onClick={() => {
                                                        highlightStreetPath(wayPoint);
                                                        centerPoint(wayPoint.pointTo.lat, wayPoint.pointTo.lon);
                                                    }}
                                                >
                                                    <GeoLinkIcon />
                                                </Button>
                                                <Button
                                                    type={'button'}
                                                    variant={'link'}
                                                    size={'sm'}
                                                    title={intl.formatMessage({
                                                        id: editingEnd
                                                            ? 'msg.cancelStreetEndEdit'
                                                            : 'msg.editStreetEnd',
                                                    })}
                                                    aria-label={intl.formatMessage({
                                                        id: editingEnd
                                                            ? 'msg.cancelStreetEndEdit'
                                                            : 'msg.editStreetEnd',
                                                    })}
                                                    onClick={() =>
                                                        editingEnd
                                                            ? dispatch(mapActions.setStreetPointSelection(undefined))
                                                            : openSelection(wayPoint, 'end')
                                                    }
                                                >
                                                    {editingEnd ? <CancelIcon /> : <EditIcon />}
                                                </Button>
                                            </td>
                                            <td>{wayPoint.streetName ?? <FormattedMessage id={'msg.unknown'} />}</td>
                                            <td>{formatNumber(wayPoint.distanceInKm ?? 0, 2)}</td>
                                            <td>{getStreetPath(wayPoint).length}</td>
                                        </>
                                    );
                                })()}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
};
