import { useDispatch, useSelector } from 'react-redux';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getNumberOfPositionsInTracks } from '../map/hooks/trackSimulationReader.ts';
import { Button } from 'react-bootstrap';
import { AppDispatch } from '../../store/store.ts';
import { useState } from 'react';
import { storage } from '../../store/storage.ts';
import { resolvePositions } from '../../mapMatching/mapMatchingStreetResolver.ts';

export function TrackDataOverview() {
    const calculatedTracks = useSelector(getCalculatedTracks);
    const dispatch: AppDispatch = useDispatch();
    const [positions, setPositions] = useState<any>();

    const { positionCount, uniquePositionCount, unresolvedUniquePositionCount } = getNumberOfPositionsInTracks();

    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Overview of calculated Data</h4>
            <ul>
                <li>{`${calculatedTracks.length} Tracks`}</li>
                <li>{`${positionCount} Positions`}</li>
                <li>{`${uniquePositionCount} unique Positions`}</li>
                <li>{`${unresolvedUniquePositionCount} unresolved unique Positions`}</li>
            </ul>

            <Button onClick={() => dispatch(resolvePositions)}>Trigger the calculation</Button>
            <div>{JSON.stringify(positions)}</div>
            <Button
                onClick={() => {
                    setPositions(storage.getResolvedPositions());
                }}
            >
                Look at the stuff
            </Button>
        </div>
    );
}
