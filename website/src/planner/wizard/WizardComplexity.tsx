import { Card, Col, Container, Row } from 'react-bootstrap';
import line from '../../assets/line.svg';
import mergeTracks from '../../assets/mergeTracks.svg';
import { WizardHeader } from './WizardHeader.tsx';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../store/layout.reducer.ts';
import { Sections } from '../layout/types.ts';
import { DirectlyToPlannerButton } from './DirectlyToPlannerButton.tsx';

const cardStyle = {
    style: { minWidth: '18rem', minHeight: '25rem', cursor: 'pointer' },
    className: 'startPageCard shadow m-2',
};

export const WizardsComplexity = () => {
    const dispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));
    const continueAsSimpleRally = () => {
        setSelectedSection('wizard-parameters');
    };
    const continueAsComplexRally = () => setSelectedSection('importExport');

    return (
        <Container>
            <WizardHeader />
            <h5 className={'mb-5'}>Choose your situation:</h5>
            <Row>
                <Col>
                    <Card {...cardStyle} onClick={continueAsSimpleRally}>
                        <Card.Body>
                            <Card.Title>Simple</Card.Title>
                            <Card.Text style={{ minHeight: '3rem' }}>Each Gps Segment should be a track</Card.Text>
                            <img
                                src={line}
                                className="m-1"
                                alt="simple route"
                                style={{ height: '10rem', width: '10rem' }}
                                color={'#ffffff'}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card {...cardStyle} onClick={continueAsComplexRally}>
                        <Card.Body>
                            <Card.Title>Complex</Card.Title>
                            <Card.Text style={{ minHeight: '3rem' }}>
                                Gps segments are shared and a track consists of multiple segments
                            </Card.Text>
                            <img
                                src={mergeTracks}
                                className="m-1"
                                alt="complex route  "
                                style={{ height: '10rem', width: '10rem' }}
                                color={'#ffffff'}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DirectlyToPlannerButton />
                </Col>
            </Row>
        </Container>
    );
};
