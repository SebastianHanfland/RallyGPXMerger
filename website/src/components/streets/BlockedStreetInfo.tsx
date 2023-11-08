import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';
import { StreetMapLink } from './StreetMapLink.tsx';
import { useSelector } from 'react-redux';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';

export const BlockedStreetInfo = () => {
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);

    return (
        <div>
            <h5>{'Blocked Streets'}</h5>
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Post code</th>
                        <th>Street</th>
                        <th>Duration</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Map</th>
                    </tr>
                </thead>
                <tbody>
                    {blockedStreetInfos.map(({ streetName, start, end, postCode, pointFrom, pointTo }) => (
                        <tr key={end}>
                            <td>{postCode ?? 'Unknown'}</td>
                            <td>{streetName}</td>
                            <td>{getTimeDifferenceInSeconds(end, start).toFixed(0)} s</td>
                            <td>{formatTimeOnly(start)}</td>
                            <td>{formatTimeOnly(end)}</td>
                            <td>
                                <StreetMapLink pointTo={pointTo} pointFrom={pointFrom} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
