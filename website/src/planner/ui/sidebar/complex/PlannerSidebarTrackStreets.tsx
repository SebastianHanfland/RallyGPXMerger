import { useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import { TrackWayPointType } from '../../../logic/resolving/types';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos';
import { getParsedGpxSegments, getNextStreetLookupIndex } from '../../../store/segmentData.redux';
import { getStreetPointSelection, mapActions } from '../../../store/map.reducer';
import { AppDispatch } from '../../../store/planningStore';
import { TrackComposition } from '../../../store/types';
import { getRoutePointReferences } from '../../../logic/resolving/streets/streetRangeEditing';
import { beginNewStreet, getStreetPath } from '../../../streets/streetEditing';
import { PlannerSidebarTrackStreetRow } from './PlannerSidebarTrackStreetRow';
import { StreetInsertionRail } from './StreetInsertionRail';
import { useStreetInsertionPositions } from './useStreetInsertionPositions';

interface Props {
    track: TrackComposition;
}

const headerRowKeys = [
    'msg.start',
    'msg.end',
    'msg.street',
    'msg.postCode',
    'msg.district',
    'msg.length',
    'msg.streetPoints',
];

export const PlannerSidebarTrackStreets = ({ track }: Props) => {
    const trackStreetInfo = useSelector(getTrackStreetInfos).find((trackInfo) => trackInfo.id === track.id);
    const parsedSegments = useSelector(getParsedGpxSegments);
    const nextStreetLookupIndex = useSelector(getNextStreetLookupIndex);
    const selection = useSelector(getStreetPointSelection);
    const dispatch: AppDispatch = useDispatch();
    const routePoints = useMemo(() => getRoutePointReferences(track, parsedSegments), [track, parsedSegments]);
    const streets = trackStreetInfo?.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Track) ?? [];
    const { tableRef, rowRefs, insertionPositions } = useStreetInsertionPositions(streets.length);

    useEffect(
        () => () => {
            dispatch(mapActions.setHighlightedStreetPath(undefined));
            dispatch(mapActions.setStreetPointSelection(undefined));
        },
        [dispatch]
    );

    const highlightStreetPath = (wayPoint: (typeof streets)[number]) => {
        dispatch(mapActions.setHighlightedStreetPath(getStreetPath(wayPoint)));
    };
    const startNewStreet = (insertionIndex: number) => {
        beginNewStreet(dispatch, nextStreetLookupIndex, track, routePoints, insertionIndex);
    };

    return (
        <div className="position-relative" style={{ paddingLeft: '2.5rem' }}>
            <StreetInsertionRail
                positions={insertionPositions}
                trackId={track.id}
                selection={selection}
                dispatch={dispatch}
                onStart={startNewStreet}
            />
            <Table ref={tableRef} data-testid="track-street-list" size="sm" striped hover>
                <thead>
                    <tr>
                        {headerRowKeys.map((messageKey) => (
                            <th key={messageKey}>
                                <FormattedMessage id={messageKey} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {streets.map((wayPoint, index) => (
                        <PlannerSidebarTrackStreetRow
                            key={`${wayPoint.s ?? 'street'}-${index}`}
                            ref={(row) => {
                                rowRefs.current[index] = row;
                            }}
                            track={track}
                            wayPoint={wayPoint}
                            routePoints={routePoints}
                            onHighlight={highlightStreetPath}
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
