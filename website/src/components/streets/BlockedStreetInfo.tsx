import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';
import { StreetMapLink } from './StreetMapLink.tsx';
import { useSelector } from 'react-redux';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
import { HighlightUnknown } from './HighlightUnknown.tsx';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../../logic/speedSimulator.ts';

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
                        <th>Length</th>
                        <th>Duration</th>
                        <th>Arrival of front</th>
                        <th>Passage of back</th>
                        <th>Map</th>
                    </tr>
                </thead>
                <tbody>
                    {blockedStreetInfos.map(
                        ({ streetName, frontArrival, backPassage, postCode, pointFrom, pointTo }) => (
                            <tr key={backPassage}>
                                <td>
                                    <HighlightUnknown value={postCode?.toString() ?? 'Unknown'} />
                                </td>
                                <td>
                                    <HighlightUnknown value={streetName} />
                                </td>
                                <td>{(geoDistance(toLatLng(pointFrom), toLatLng(pointTo)) as number).toFixed(2)} km</td>
                                <td>{(getTimeDifferenceInSeconds(backPassage, frontArrival) / 60).toFixed(1)} min</td>
                                <td>{formatTimeOnly(frontArrival)}</td>
                                <td>{formatTimeOnly(backPassage)}</td>
                                <td>
                                    <StreetMapLink pointTo={pointTo} pointFrom={pointFrom} />
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </Table>
        </div>
    );
};
