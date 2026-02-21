import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { useSelector } from 'react-redux';
import { TrackPrio } from '../tracks/components/TrackPrio.tsx';

export const TrackPriorityTable = () => {
    const tracks = useSelector(getTrackCompositions);
    return (
        <div>
            <Table striped bordered hover style={{ width: '100%' }} size="sm">
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id={'msg.trackName'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.trackPeople'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.priority'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => (
                        <tr key={track.id}>
                            <td>{track.name}</td>
                            <td>{track.peopleCount ?? 0}</td>
                            <td>
                                <TrackPrio track={track} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
