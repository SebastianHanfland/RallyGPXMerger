import { useEffect, useMemo } from 'react';
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
import { getStreetPointSelection, mapActions } from '../../../store/map.reducer.ts';
import {
    getRoutePointReferences,
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
    useEffect(() => {
        if (!selection?.selectedPoint || selection.trackId !== track.id) return;
        const selectedRouteIndex = routePoints.findIndex(
            ({ segmentId, pointIndex }) =>
                segmentId === selection.selectedPoint?.segmentId && pointIndex === selection.selectedPoint?.pointIndex
        );
        if (selectedRouteIndex < 0) return;
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
    return (
        <>
            <Table data-testid={'track-street-list'} size={'sm'} striped hover>
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
                        <tr key={`${wayPoint.s ?? 'street'}-${index}`}>
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
                                                    id: editingEnd ? 'msg.cancelStreetEndEdit' : 'msg.editStreetEnd',
                                                })}
                                                aria-label={intl.formatMessage({
                                                    id: editingEnd ? 'msg.cancelStreetEndEdit' : 'msg.editStreetEnd',
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
        </>
    );
};
