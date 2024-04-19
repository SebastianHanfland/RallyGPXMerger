import { Col, Row, Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { formatNumber } from '../../utils/numberUtil.ts';
import { formatTimeOnly, roundStartTimes } from '../../utils/dateUtil.ts';
import { TrackOverviewDownload } from './TrackOverviewDownload.tsx';

export const TracksOverview = () => {
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);

    return (
        <div>
            <Row>
                <h3 className={'mb-5'}>
                    <FormattedMessage id={'msg.tracks'} />
                </h3>
                <div className={'mb-5'}>
                    <TrackOverviewDownload />
                </div>
            </Row>
            <Row
                className="flex-xl-nowrap"
                style={{ height: '70vh', minHeight: '200px', width: '100%', overflowY: 'auto' }}
            >
                <Col className={'m-3'}>
                    <Table striped bordered hover style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>
                                    <FormattedMessage id={'msg.track'} />
                                </th>
                                <th>
                                    <FormattedMessage id={'msg.distanceInKm'} />
                                </th>
                                <th>
                                    <FormattedMessage id={'msg.trackPeople'} />
                                </th>
                                <th>
                                    <FormattedMessage id={'msg.communicatedStart'} />
                                </th>
                                <th>
                                    <FormattedMessage id={'msg.start'} />
                                </th>
                                <th>
                                    <FormattedMessage id={'msg.arrival'} />
                                </th>
                                <th>
                                    <FormattedMessage id={'msg.end'} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {trackStreetInfos.map((info) => (
                                <tr key={info.id}>
                                    <td>{info.name}</td>
                                    <td>{formatNumber(info.distanceInKm)}</td>
                                    <td>{info.peopleCount ?? ''}</td>
                                    <td>{formatTimeOnly(roundStartTimes(info.startFront, info.name))}</td>
                                    <td>{formatTimeOnly(info.startFront)}</td>
                                    <td>{formatTimeOnly(info.arrivalFront)}</td>
                                    <td>{formatTimeOnly(info.arrivalBack)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
};
