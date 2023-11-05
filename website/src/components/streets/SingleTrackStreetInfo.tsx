import { TrackStreetInfo } from '../../mapMatching/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';

interface Props {
    trackStreetInfo: TrackStreetInfo;
}

export const SingleTrackStreetInfo = ({ trackStreetInfo }: Props) => {
    const { name, wayPoints, distanceInKm, start, end } = trackStreetInfo;
    const average = (distanceInKm / getTimeDifferenceInSeconds(end, start)) * 60 * 60;
    return (
        <div>
            <h5>{name}</h5>
            <div>{`Distance: ${distanceInKm.toFixed(2)} km`}</div>
            <div>{`Start: ${formatTimeOnly(start)}`}</div>
            <div>{`End: ${formatTimeOnly(end)}`}</div>
            <div>{`Average speed: ${average.toFixed(1)} km/h`}</div>
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
                        <tr key={to}>
                            <td>{streetName}</td>
                            <td>{getTimeDifferenceInSeconds(to, from).toFixed(0)} s</td>
                            <td>{formatTimeOnly(from)}</td>
                            <td>{formatTimeOnly(to)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
