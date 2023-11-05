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
            <div className={'d-flex justify-content-between'}>
                <div className={'m-3'}>{`Distance: ${distanceInKm.toFixed(2)} km`}</div>
                <div className={'m-3'}>{`Start: ${formatTimeOnly(start)}`}</div>
                <div className={'m-3'}>{`End: ${formatTimeOnly(end)}`}</div>
                <div className={'m-3'}>{`Average speed: ${average.toFixed(1)} km/h`}</div>
            </div>
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
