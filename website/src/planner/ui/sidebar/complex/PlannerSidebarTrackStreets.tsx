import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import { EditIcon } from '../../../../utils/icons/EditIcon.tsx';
import { GeoLinkIcon } from '../../../../utils/icons/GeoLinkIcon.tsx';
import { formatNumber } from '../../../../utils/numberUtil.ts';
import { TrackComposition } from '../../../store/types.ts';
import { TrackWayPointType } from '../../../logic/resolving/types.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { getParsedGpxSegments, getStreetLookup, segmentDataActions } from '../../../store/segmentData.redux.ts';
import { mapActions } from '../../../store/map.reducer.ts';
import {
    getRoutePointReferences,
    getStreetRange,
    getStreetRangeAssignments,
} from '../../../logic/resolving/streets/streetRangeEditing.ts';
import { StreetPointSelectionModal } from './StreetPointSelectionModal.tsx';

interface Props {
    track: TrackComposition;
}
interface SelectionState {
    boundary: 'start' | 'end';
    streetIndex: number;
    range: { start: number; end: number };
}

export const PlannerSidebarTrackStreets = ({ track }: Props) => {
    const trackStreetInfo = useSelector(getTrackStreetInfos).find((trackInfo) => trackInfo.id === track.id);
    const parsedSegments = useSelector(getParsedGpxSegments);
    const streetLookup = useSelector(getStreetLookup);
    const dispatch = useDispatch();
    const intl = useIntl();
    const [selection, setSelection] = useState<SelectionState>();
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
        const range = getStreetRange(routePoints, streetIndex);
        if (range) setSelection({ boundary, streetIndex, range });
    };
    const selectPoint = (pointIndex: number) => {
        if (!selection) return;
        dispatch(
            segmentDataActions.applyStreetRangeAssignments(
                getStreetRangeAssignments(
                    routePoints,
                    selection.streetIndex,
                    selection.range,
                    selection.boundary,
                    pointIndex
                )
            )
        );
        setSelection(undefined);
    };
    useEffect(
        () => () => {
            dispatch(mapActions.setHighlightedStreetPath(undefined));
        },
        [dispatch]
    );
    const streets = trackStreetInfo?.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Track) ?? [];
    const selectablePointIndexes = selection
        ? new Set(
              Array.from({ length: routePoints.length }, (_, index) => index).filter((index) =>
                  selection.boundary === 'start' ? index <= selection.range.end : index >= selection.range.start
              )
          )
        : new Set<number>();

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
                                    title={intl.formatMessage({ id: 'msg.editStreetStart' })}
                                    aria-label={intl.formatMessage({ id: 'msg.editStreetStart' })}
                                    onClick={() => openSelection(wayPoint, 'start')}
                                >
                                    <EditIcon />
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
                                    title={intl.formatMessage({ id: 'msg.editStreetEnd' })}
                                    aria-label={intl.formatMessage({ id: 'msg.editStreetEnd' })}
                                    onClick={() => openSelection(wayPoint, 'end')}
                                >
                                    <EditIcon />
                                </Button>
                            </td>
                            <td>{wayPoint.streetName ?? <FormattedMessage id={'msg.unknown'} />}</td>
                            <td>{formatNumber(wayPoint.distanceInKm ?? 0, 2)}</td>
                            <td>{getStreetPath(wayPoint).length}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {selection && (
                <StreetPointSelectionModal
                    boundary={selection.boundary}
                    points={routePoints}
                    selectablePointIndexes={selectablePointIndexes}
                    streetLookup={streetLookup}
                    onSelect={selectPoint}
                    onClose={() => setSelection(undefined)}
                />
            )}
        </>
    );
};
