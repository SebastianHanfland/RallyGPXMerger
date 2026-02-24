import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';
import info from '../../../../assets/info.svg';
import { HighlightUnknown } from '../../../streets/HighlightUnknown.tsx';
import { StreetMapLink } from '../../../streets/StreetMapLink.tsx';
import { formatNumber } from '../../../../utils/numberUtil.ts';
import { getBlockedStreetInfo } from '../../../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { wayPointHasUnknown } from '../../../streets/unknownUtil.ts';

export const BlockedStreetsModalContent = () => {
    const intl = useIntl();
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const unknown = intl.formatMessage({ id: 'msg.unknown' });
    return (
        <div>
            <Table striped bordered hover style={{ width: '100%' }}>
                <colgroup>
                    <col span={1} style={{ width: '20%' }} />
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '12%' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id={'msg.street'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.postCode'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.district'} />
                        </th>
                        <th>
                            <div title={intl.formatMessage({ id: 'msg.blockage.hint' })}>
                                ( <FormattedMessage id={'msg.blockage'} />
                                <img src={info} className={'m-1'} alt="help" />)
                            </div>
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
                    {blockedStreetInfos
                        .filter((street) => !wayPointHasUnknown(street, unknown))
                        .sort((a, b) => ((a.streetName ?? '') > (b.streetName ?? '') ? 1 : -1))
                        .map((street) => {
                            const { streetName, backPassage, frontArrival, postCode, district, pointTo, pointFrom } =
                                street;
                            return (
                                <tr key={backPassage + streetName + frontArrival}>
                                    <td>
                                        <HighlightUnknown value={streetName ?? unknown} />
                                        <StreetMapLink pointTo={pointTo} pointFrom={pointFrom} />
                                    </td>
                                    <td>
                                        <HighlightUnknown value={postCode?.toString() ?? unknown} />
                                    </td>
                                    <td>
                                        <HighlightUnknown value={district?.toString() ?? unknown} />
                                    </td>
                                    {/*<td>{formatNumber(distanceInKm ?? 0, 2)} km</td>*/}
                                    <td>
                                        {formatNumber(getTimeDifferenceInSeconds(backPassage, frontArrival) / 60, 1)}{' '}
                                        min
                                    </td>
                                    <td>{formatTimeOnly(frontArrival)}</td>
                                    <td>{formatTimeOnly(backPassage)}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};
