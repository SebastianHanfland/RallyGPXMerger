import { TrackButtonsCell } from '../../../../tracks/TrackButtonsCell';
import { FormattedMessage } from 'react-intl';
import { TrackComposition } from '../../../../store/types';
import { TrackSegmentSelection } from '../../../../tracks/segment-selection/TrackSegmentSelection';
import { PlannerSidebarTrackFormDetails } from './PlannerSidebarTrackFormDetails';
import { PlannerSidebarTrackInfo } from './PlannerSidebarTrackInfo';
import { useSelector } from 'react-redux';
import { TrackDocuments } from '../../../../tracks/components/TrackDocuments';
import { getTrackStreetInfos } from '../../../../calculation/getTrackStreetInfos';
import { Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { useState } from 'react';
import { PlannerSidebarTrackStreets } from './PlannerSidebarTrackStreets';
import { TrackStartName } from '../../../../tracks/components/TrackStartName';
import { TrackBuffer } from '../../../../tracks/components/TrackBuffer';
import { TrackRounding } from '../../../../tracks/components/TrackRounding';
import { formatFixedNumber } from '../../../../../utils/numberUtil';

export const PlannerSidebarTrackDetails = ({ track }: { track: TrackComposition }) => {
    const { name } = track;
    const [activeTab, setActiveTab] = useState('segments');
    const trackInfos = useSelector(getTrackStreetInfos);
    const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
    const distanceInfo = matchedTrackInfo?.distanceInKm
        ? ` (${formatFixedNumber(matchedTrackInfo.distanceInKm, 2)} km)`
        : '';
    return (
        <div className={'m-2'}>
            <div className={'m-3'}>
                <h4 className={'d-flex justify-content-around'}>
                    <div>
                        <span className={'mx-2'}>{`${name}${distanceInfo}`}</span>
                        <TrackButtonsCell track={track} />
                    </div>
                    <TrackDocuments matchedTrackInfo={matchedTrackInfo} />
                </h4>
                <PlannerSidebarTrackFormDetails track={track} />
            </div>

            <div style={{ width: '100%' }} className={'my-2'}>
                <Tabs activeKey={activeTab} onSelect={(key) => key && setActiveTab(key)}>
                    <Tab
                        eventKey={'segments'}
                        title={<FormattedMessage id={'msg.segments'} />}
                        mountOnEnter={true}
                        unmountOnExit={true}
                    >
                        <div className={'m-3'}>
                            <TrackSegmentSelection track={track} />
                        </div>
                    </Tab>
                    <Tab
                        eventKey={'streets'}
                        title={<FormattedMessage id={'msg.streets'} />}
                        mountOnEnter={true}
                        unmountOnExit={true}
                    >
                        <PlannerSidebarTrackStreets track={track} />
                    </Tab>
                    <Tab
                        eventKey={'info'}
                        title={<FormattedMessage id={'msg.info'} />}
                        mountOnEnter={true}
                        unmountOnExit={true}
                    >
                        <div className="m-3">
                            <PlannerSidebarTrackInfo trackInfo={matchedTrackInfo} />
                            <Form.Group as={Row}>
                                <Col>
                                    <Form.Label>
                                        <FormattedMessage id="msg.startName" />
                                    </Form.Label>
                                    <TrackStartName track={track} />
                                </Col>
                                <Col>
                                    <Form.Label>
                                        <FormattedMessage id="msg.buffer" />
                                    </Form.Label>
                                    <TrackBuffer track={track} />
                                </Col>
                                <Col>
                                    <Form.Label>
                                        <FormattedMessage id="msg.rounding" />
                                    </Form.Label>
                                    <TrackRounding track={track} />
                                </Col>
                            </Form.Group>
                        </div>
                    </Tab>
                </Tabs>
            </div>
            <div></div>
        </div>
    );
};
