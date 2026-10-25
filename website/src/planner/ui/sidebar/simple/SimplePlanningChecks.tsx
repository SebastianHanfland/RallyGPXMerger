import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { CheckIcon } from '../../../../utils/icons/CheckIcon.tsx';
import { WarningIcon } from '../../../../utils/icons/WarningIcon.tsx';
import { GapOverview } from '../../../points/GapOverview.tsx';
import { StreetInfoModal } from '../../elements/StreetInfoModal.tsx';
import { PlannerSidebarSimpleSettings } from './PlannerSidebarSimpleSettings.tsx';
import { useOverviewAccordionStatuses } from '../complex/overviewStatus.ts';
import type { TrackStreetInfo } from '../../../logic/resolving/types.ts';

interface Props {
    matchedTrackInfo: TrackStreetInfo | undefined;
}

export function SimplePlanningChecks({ matchedTrackInfo }: Props) {
    const { gaps, checks } = useOverviewAccordionStatuses();
    const [displayGaps, setDisplayGaps] = useState(false);
    const [displaySettings, setDisplaySettings] = useState(false);
    const [displayStreetInfo, setDisplayStreetInfo] = useState(false);

    return (
        <>
            <h5>
                <FormattedMessage id={'msg.planningChecks'} />
            </h5>
            <Row className={'m-1'}>
                <Col>
                    <Button size={'sm'} onClick={() => setDisplayGaps(true)}>
                        <span aria-hidden="true">{gaps.warning ? <WarningIcon /> : <CheckIcon />}</span>
                        <FormattedMessage id={'msg.gaps'} />
                    </Button>
                </Col>
                <Col>
                    <Button size={'sm'} onClick={() => setDisplayStreetInfo(true)} disabled={!matchedTrackInfo}>
                        <span aria-hidden="true">{checks.warning ? <WarningIcon /> : <CheckIcon />}</span>
                        <FormattedMessage id={'msg.unknownStreets'} />
                    </Button>
                </Col>
                <Col>
                    <Button size={'sm'} onClick={() => setDisplaySettings(true)}>
                        <FormattedMessage id={'msg.settings'} />
                    </Button>
                </Col>

                <Modal show={displayGaps} onHide={() => setDisplayGaps(false)} size={'xl'}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FormattedMessage id={'msg.gaps'} />
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <GapOverview />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setDisplayGaps(false)}>
                            <FormattedMessage id={'msg.close'} />
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={displaySettings} onHide={() => setDisplaySettings(false)} size={'lg'}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FormattedMessage id={'msg.settings'} />
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PlannerSidebarSimpleSettings />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setDisplaySettings(false)}>
                            <FormattedMessage id={'msg.close'} />
                        </Button>
                    </Modal.Footer>
                </Modal>

                {displayStreetInfo && matchedTrackInfo && (
                    <StreetInfoModal selectedTrack={matchedTrackInfo} onHide={() => setDisplayStreetInfo(false)} />
                )}
            </Row>
        </>
    );
}
