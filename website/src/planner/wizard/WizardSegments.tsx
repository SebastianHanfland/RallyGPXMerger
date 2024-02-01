import { useDispatch } from 'react-redux';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { WizardHeader } from './WizardHeader.tsx';
import { layoutActions } from '../store/layout.reducer.ts';
import { Sections } from '../layout/types.ts';
import { GpxSegments } from '../segments/GpxSegments.tsx';

export const WizardSegments = () => {
    const dispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));

    return (
        <Container>
            <WizardHeader />
            <h5>Upload single segments here, which will be used to construct different tracks</h5>
            <Row>
                <Col>
                    <Button className={'my-4'} onClick={() => setSelectedSection('gps')}>
                        Continue
                    </Button>
                    <GpxSegments noFilter={true} />
                    <Button className={'my-4'} onClick={() => setSelectedSection('gps')}>
                        Continue
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
