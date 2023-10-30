import { Table } from 'react-bootstrap';
import { MergeTableTrack } from './MergeTableTrack.tsx';
import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { AddNewTrack } from './AddNewTrack.tsx';

export const MergeTable = () => {
    const trackCompositions = useSelector(getTrackCompositions);
    return (
        <Table striped bordered hover style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th style={{ width: '25%' }}>Track name</th>
                    <th style={{ width: '75%' }}>Track components</th>
                    <th style={{ width: '10%', minWidth: '40px' }} />
                </tr>
            </thead>
            <tbody>
                {trackCompositions.map((track) => (
                    <MergeTableTrack key={track.id} track={track} />
                ))}

                <AddNewTrack />
            </tbody>
        </Table>
    );
};
