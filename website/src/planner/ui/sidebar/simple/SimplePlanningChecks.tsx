import { Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useOverviewAccordionStatuses } from '../complex/overviewStatus.ts';
import type { TrackStreetInfo } from '../../../logic/resolving/types.ts';
import { SimpleGapsButton } from './SimpleGapsButton.tsx';
import { SimpleSettingsButton } from './SimpleSettingsButton.tsx';
import { SimpleUnknownStreetsButton } from './SimpleUnknownStreetsButton.tsx';
import { SimplePointsButton } from './SimplePointsButton.tsx';

interface Props {
    matchedTrackInfo: TrackStreetInfo | undefined;
}

export function SimplePlanningChecks({ matchedTrackInfo }: Props) {
    const { gaps, checks, points } = useOverviewAccordionStatuses();

    return (
        <>
            <h5>
                <FormattedMessage id={'msg.planningChecks'} />
            </h5>
            <Row className={'m-1'}>
                <Col>
                    <SimpleGapsButton warning={gaps.warning} />
                </Col>
                <Col>
                    <SimpleUnknownStreetsButton warning={checks.warning} matchedTrackInfo={matchedTrackInfo} />
                </Col>
                <Col>
                    <SimplePointsButton points={points} />
                </Col>
                <Col>
                    <SimpleSettingsButton />
                </Col>
            </Row>
        </>
    );
}
