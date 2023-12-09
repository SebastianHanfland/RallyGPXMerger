import { Table } from 'react-bootstrap';
import { MergeTableTrack } from './MergeTableTrack.tsx';
import { AddNewTrack } from './AddNewTrack.tsx';
import { TrackComposition } from '../../store/types.ts';

interface Props {
    trackCompositions: TrackComposition[];
}

export const MergeTable = ({ trackCompositions }: Props) => {
    return (
        <Table striped bordered hover style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th style={{ width: '30%' }}>Track name</th>
                    <th style={{ width: '40%' }}>Track components</th>
                    <th style={{ width: '30%', minWidth: '210px' }} />
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
