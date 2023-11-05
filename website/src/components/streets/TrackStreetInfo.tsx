import { TrackStreetInfo } from '../../mapMatching/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';

interface Props {
    trackStreetInfo: TrackStreetInfo;
}

export const SingleTrackStreetInfo = ({ trackStreetInfo }: Props) => {
    const { name, wayPoints } = trackStreetInfo;
    return (
        <div>
            <h5>{name}</h5>
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Street</th>
                        <th>Duration</th>
                        <th>From</th>
                        <th>To</th>
                    </tr>
                </thead>
                <tbody>
                    {wayPoints.map(({ streetName, to, from }) => (
                        <tr>
                            <td>{streetName}</td>
                            <td>{getTimeDifferenceInSeconds(to, from)} s</td>
                            <td>{formatTimeOnly(from)}</td>
                            <td>{formatTimeOnly(to)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
