import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';
import { StreetMapLink } from './StreetMapLink.tsx';
import { useSelector } from 'react-redux';
import { getBlockedStreetInfo } from '../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { HighlightUnknown } from './HighlightUnknown.tsx';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../logic/merge/speedSimulator.ts';
import { getOnlyShowUnknown } from '../store/geoCoding.reducer.ts';
import { useIntl } from 'react-intl';

export const BlockedStreetInfo = () => {
    const intl = useIntl();
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const onlyShowUnknown = useSelector(getOnlyShowUnknown);

    const filteredBlockedStreets = blockedStreetInfos.filter((blockedStreetInfos) =>
        onlyShowUnknown
            ? blockedStreetInfos.streetName === intl.formatMessage({ id: 'msg.unknown' }) ||
              blockedStreetInfos.postCode === undefined ||
              blockedStreetInfos.district === undefined
            : true
    );

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
                    {filteredBlockedStreets.map(
                        ({ streetName, frontArrival, backPassage, postCode, district, pointFrom, pointTo }) => (
                            <tr key={backPassage + streetName + frontArrival}>
                                <td>
                                    <HighlightUnknown
                                        value={postCode?.toString() ?? intl.formatMessage({ id: 'msg.unknown' })}
                                    />
                                    <StreetMapLink pointTo={pointTo} pointFrom={pointFrom} streetName={streetName} />
                                </td>
                                <td>
                                    <HighlightUnknown value={district ?? intl.formatMessage({ id: 'msg.unknown' })} />
                                </td>
                                <td>
                                    <HighlightUnknown value={streetName} />
                                </td>
                                <td>{(geoDistance(toLatLng(pointFrom), toLatLng(pointTo)) as number).toFixed(2)} km</td>
                                <td>{(getTimeDifferenceInSeconds(backPassage, frontArrival) / 60).toFixed(1)} min</td>
                                <td>{formatTimeOnly(frontArrival)}</td>
                                <td>{formatTimeOnly(backPassage)}</td>
                            </tr>
                        )
                    )}
                </tbody>
            </Table>
        </div>
    );
};
