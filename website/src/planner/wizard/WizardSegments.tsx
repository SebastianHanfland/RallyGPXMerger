import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { WizardHeader } from './WizardHeader.tsx';
import { layoutActions } from '../store/layout.reducer.ts';
import { Sections } from '../layout/types.ts';
import { GpxSegments } from '../segments/GpxSegments.tsx';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { DirectlyToPlannerButton } from './DirectlyToPlannerButton.tsx';
import { FormattedMessage } from 'react-intl';
import { GpxCreationHint } from '../segments/GpxCreationHint.tsx';

export const WizardSegments = () => {
    const dispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));
    const gpxSegments = useSelector(getGpxSegments);

    return (
        <Container>
            <WizardHeader />
            <h5>
                <FormattedMessage id={'msg.wizardSegments.title'} />
            </h5>
            <GpxCreationHint />
            <Row>
                <Col>
                    {gpxSegments.length > 5 && (
                        <Button className={'my-4'} onClick={() => setSelectedSection('wizard-complexity')}>
                            <FormattedMessage id={'msg.continue'} />
                        </Button>
                    )}
                    <GpxSegments noFilter={true} />
                    <DirectlyToPlannerButton />
                    <Button
                        className={'m-4'}
                        onClick={() => setSelectedSection('wizard-complexity')}
                        disabled={gpxSegments.length === 0}
                    >
                        <FormattedMessage id={'msg.continue'} />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
