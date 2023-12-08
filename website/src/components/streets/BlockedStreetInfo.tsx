import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';
import { StreetMapLink } from './StreetMapLink.tsx';
import { useSelector } from 'react-redux';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
import { HighlightUnknown } from './HighlightUnknown.tsx';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../../logic/speedSimulator.ts';
import { getOnlyShowUnknown } from '../../store/geoCoding.reducer.ts';

export const BlockedStreetInfo = () => {
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const onlyShowUnknown = useSelector(getOnlyShowUnknown);

    return (
        <div>
            <h5>{'Blocked Streets'}</h5>
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Post code</th>
                        <th>District</th>
                        <th>Street</th>
                        <th>Length</th>
                        <th>Duration</th>
                        <th>Arrival of front</th>
                        <th>Passage of back</th>
                    </tr>
                </thead>
                <tbody>
                    {blockedStreetInfos
                        .filter((blockedStreetInfos) =>
                            onlyShowUnknown ? blockedStreetInfos.streetName === 'Unknown' : true
                        )
                        .map(({ streetName, frontArrival, backPassage, postCode, district, pointFrom, pointTo }) => (
                            <tr key={backPassage}>
                                <td>
                                    <HighlightUnknown value={postCode?.toString() ?? 'Unknown'} />
                                    <StreetMapLink pointTo={pointTo} pointFrom={pointFrom} streetName={streetName} />
                                </td>
                                <td>
                                    <HighlightUnknown value={district ?? 'Unknown'} />
                                </td>
                                <td>
                                    <HighlightUnknown value={streetName} />
                                </td>
                                <td>{(geoDistance(toLatLng(pointFrom), toLatLng(pointTo)) as number).toFixed(2)} km</td>
                                <td>{(getTimeDifferenceInSeconds(backPassage, frontArrival) / 60).toFixed(1)} min</td>
                                <td>{formatTimeOnly(frontArrival)}</td>
                                <td>{formatTimeOnly(backPassage)}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
};
