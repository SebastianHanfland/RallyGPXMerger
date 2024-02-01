import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { WizardHeader } from './WizardHeader.tsx';
import { layoutActions } from '../store/layout.reducer.ts';
import { Sections } from '../layout/types.ts';
import { GpxSegments } from '../segments/GpxSegments.tsx';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';

export const WizardSegments = () => {
    const dispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));
    const gpxSegments = useSelector(getGpxSegments);

    return (
        <Container>
            <WizardHeader />
            <h5>Upload single segments here, which will be used to construct different tracks</h5>
            <Row>
                <Col>
                    {gpxSegments.length > 5 && (
                        <Button className={'my-4'} onClick={() => setSelectedSection('wizard-complexity')}>
                            Continue
                        </Button>
                    )}
                    <GpxSegments noFilter={true} />
                    <Button
                        className={'m-4'}
                        variant={'secondary'}
                        onClick={() => setSelectedSection('gps')}
                        disabled={gpxSegments.length === 0}
                    >
                        Go Directly to the planner
                    </Button>
                    <Button
                        className={'m-4'}
                        onClick={() => setSelectedSection('wizard-complexity')}
                        disabled={gpxSegments.length === 0}
                    >
                        Continue
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
