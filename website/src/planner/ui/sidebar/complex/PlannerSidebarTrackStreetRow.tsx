import { Button } from 'react-bootstrap';
import { forwardRef } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CancelIcon } from '../../../../utils/icons/CancelIcon';
import { EditIcon } from '../../../../utils/icons/EditIcon';
import { GeoLinkIcon } from '../../../../utils/icons/GeoLinkIcon';
import { formatNumber } from '../../../../utils/numberUtil';
import { WayPoint } from '../../../logic/resolving/types';
import { getStreetPointSelection, mapActions } from '../../../store/map.reducer';
import { AppDispatch } from '../../../store/planningStore';
import { TrackComposition } from '../../../store/types';
import { HighlightUnknown } from '../../../streets/HighlightUnknown';
import { EditDistrictButton } from '../../../streets/EditDistrictButton';
import { EditPostCodeButton } from '../../../streets/EditPostCodeButton';
import { EditStreetNameButton } from '../../../streets/EditStreetNameButton';
import { abortStreetSelection, beginStreetBoundaryEdit, getStreetPath } from '../../../streets/streetEditing';
import { RoutePointReference } from '../../../logic/resolving/streets/streetRangeEditing.ts';

interface Props {
    track: TrackComposition;
    wayPoint: WayPoint;
    routePoints: RoutePointReference[];
    onHighlight: (wayPoint: WayPoint) => void;
}

export const PlannerSidebarTrackStreetRow = forwardRef<HTMLTableRowElement, Props>(
    ({ track, wayPoint, routePoints, onHighlight }, ref) => {
        const dispatch: AppDispatch = useDispatch();
        const intl = useIntl();
        const selection = useSelector(getStreetPointSelection);
        const editingStart =
            selection?.trackId === track.id && selection.boundary === 'start' && selection.streetIndex === wayPoint.s;
        const editingEnd =
            selection?.trackId === track.id && selection.boundary === 'end' && selection.streetIndex === wayPoint.s;
        const centerPoint = (lat: number, lon: number) => dispatch(mapActions.setPointToCenter({ lat, lng: lon }));
        const editBoundary = (boundary: 'start' | 'end') => {
            beginStreetBoundaryEdit(dispatch, track, routePoints, wayPoint, boundary);
        };

        const boundaryButton = (boundary: 'start' | 'end') => {
            const editing = boundary === 'start' ? editingStart : editingEnd;
            return (
                <Button
                    type="button"
                    variant="link"
                    size="sm"
                    title={intl.formatMessage({
                        id: editing
                            ? `msg.cancelStreet${boundary[0].toUpperCase()}${boundary.slice(1)}Edit`
                            : `msg.editStreet${boundary[0].toUpperCase()}${boundary.slice(1)}`,
                    })}
                    aria-label={intl.formatMessage({
                        id: editing
                            ? `msg.cancelStreet${boundary[0].toUpperCase()}${boundary.slice(1)}Edit`
                            : `msg.editStreet${boundary[0].toUpperCase()}${boundary.slice(1)}`,
                    })}
                    onClick={() =>
                        editing && selection ? abortStreetSelection(dispatch, selection) : editBoundary(boundary)
                    }
                >
                    {editing ? <CancelIcon /> : <EditIcon />}
                </Button>
            );
        };

        return (
            <tr
                ref={ref}
                onMouseEnter={() => onHighlight(wayPoint)}
                onMouseLeave={() => dispatch(mapActions.setHighlightedStreetPath(undefined))}
            >
                <td>
                    <Button
                        type="button"
                        variant="link"
                        size="sm"
                        title={intl.formatMessage({ id: 'msg.goToStart' })}
                        aria-label={intl.formatMessage({ id: 'msg.goToStart' })}
                        onClick={() => {
                            onHighlight(wayPoint);
                            centerPoint(wayPoint.pointFrom.lat, wayPoint.pointFrom.lon);
                        }}
                    >
                        <GeoLinkIcon />
                    </Button>
                    {boundaryButton('start')}
                </td>
                <td>
                    <Button
                        type="button"
                        variant="link"
                        size="sm"
                        title={intl.formatMessage({ id: 'msg.goToEnd' })}
                        aria-label={intl.formatMessage({ id: 'msg.goToEnd' })}
                        onClick={() => {
                            onHighlight(wayPoint);
                            centerPoint(wayPoint.pointTo.lat, wayPoint.pointTo.lon);
                        }}
                    >
                        <GeoLinkIcon />
                    </Button>
                    {boundaryButton('end')}
                </td>
                <td>
                    <HighlightUnknown value={wayPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })} />
                    <EditStreetNameButton waypoint={wayPoint} trackId={track.id} />
                </td>
                <td>
                    <HighlightUnknown
                        value={wayPoint.postCode?.toString() ?? intl.formatMessage({ id: 'msg.unknown' })}
                    />
                    <EditPostCodeButton waypoint={wayPoint} />
                </td>
                <td>
                    <HighlightUnknown value={wayPoint.district ?? intl.formatMessage({ id: 'msg.unknown' })} />
                    <EditDistrictButton waypoint={wayPoint} />
                </td>
                <td>{formatNumber(wayPoint.distanceInKm ?? 0, 2)}</td>
                <td>{getStreetPath(wayPoint).length}</td>
            </tr>
        );
    }
);
PlannerSidebarTrackStreetRow.displayName = 'PlannerSidebarTrackStreetRow';
