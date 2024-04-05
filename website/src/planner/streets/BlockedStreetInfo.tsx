import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';
import { StreetMapLink } from './StreetMapLink.tsx';
import { useSelector } from 'react-redux';
import { getBlockedStreetInfo } from '../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { HighlightUnknown } from './HighlightUnknown.tsx';
import geoDistance from 'geo-distance-helper';
import { getOnlyShowUnknown } from '../store/geoCoding.reducer.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { toLatLng } from '../../utils/pointUtil.ts';

export const BlockedStreetInfo = () => {
    const intl = useIntl();
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const onlyShowUnknown = useSelector(getOnlyShowUnknown);
    const unknown = intl.formatMessage({ id: 'msg.unknown' });

    const filteredBlockedStreets = blockedStreetInfos.filter((blockedStreetInfos) =>
        onlyShowUnknown
            ? blockedStreetInfos.streetName === unknown ||
              !blockedStreetInfos.streetName ||
              blockedStreetInfos.postCode === undefined ||
              blockedStreetInfos.district === undefined
            : true
    );

    return (
        <div>
            <h5>
                <FormattedMessage id={'msg.blockedStreets'} />
            </h5>
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id={'msg.postCode'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.district'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.street'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.length'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.duration'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.arrivalOfFront'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.passageOfBack'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBlockedStreets.map(
                        ({ streetName, frontArrival, backPassage, postCode, district, pointFrom, pointTo }) => (
                            <tr key={backPassage + streetName + frontArrival}>
                                <td>
                                    <HighlightUnknown value={postCode?.toString() ?? unknown} />
                                    <StreetMapLink pointTo={pointTo} pointFrom={pointFrom} />
                                </td>
                                <td>
                                    <HighlightUnknown value={district ?? unknown} />
                                </td>
                                <td>
                                    <HighlightUnknown value={streetName ?? unknown} />
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
