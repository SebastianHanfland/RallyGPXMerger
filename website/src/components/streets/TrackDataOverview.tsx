import { useSelector } from 'react-redux';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getNumberOfPositionsInTracks } from '../map/hooks/trackSimulationReader.ts';

export function TrackDataOverview() {
    const calculatedTracks = useSelector(getCalculatedTracks);

    const numberOfPositionsInTracks = getNumberOfPositionsInTracks();

    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Overview of calculated Data</h4>
            <ul>
                <li>{`${calculatedTracks.length} Tracks`}</li>
                <li>{`${numberOfPositionsInTracks} Positions`}</li>
                <li>{`${numberOfPositionsInTracks} unique Positions`}</li>
                <li>{`${numberOfPositionsInTracks} unresolved Positions`}</li>
            </ul>
        </div>
    );
}
