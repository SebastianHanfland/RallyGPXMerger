import { TrackButtonsCell } from '../../../tracks/TrackButtonsCell.tsx';
import { FormattedMessage } from 'react-intl';
import { TrackComposition } from '../../../store/types.ts';
import { TrackSegmentSelection } from '../../../tracks/segment-selection/TrackSegmentSelection.tsx';
import { PlannerSidebarTrackFormDetails } from './PlannerSidebarTrackFormDetails.tsx';
import { PlannerSidebarTrackInfo } from '../PlannerSidebarTrackInfo.tsx';
import { useSelector } from 'react-redux';
import { TrackDocuments } from '../../../tracks/components/TrackDocuments.tsx';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { useState } from 'react';
import { PlannerSidebarTrackStreets } from './PlannerSidebarTrackStreets.tsx';
import { TrackStartName } from '../../../tracks/components/TrackStartName.tsx';
import { TrackBuffer } from '../../../tracks/components/TrackBuffer.tsx';
import { TrackRounding } from '../../../tracks/components/TrackRounding.tsx';

export const PlannerSidebarTrackDetails = ({ track }: { track: TrackComposition }) => {
    const { name } = track;
    const [activeTab, setActiveTab] = useState('segments');
    const trackInfos = useSelector(getTrackStreetInfos);
    const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
    const distanceInfo = matchedTrackInfo?.distanceInKm ? ` (${matchedTrackInfo.distanceInKm.toFixed(2)} km)` : '';
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
