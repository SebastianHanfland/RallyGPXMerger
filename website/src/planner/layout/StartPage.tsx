import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Sections } from './types.ts';

const cardStyle = { style: { minWidth: '18rem', minHeight: '25rem', cursor: 'pointer' }, className: 'shadow m-2' };

interface Props {
    setSelectedSection: (section: Sections) => void;
}

export const StartPage = ({ setSelectedSection }: Props) => {
    return (
        <Container>
            <h3 className={'m-5'}>Rally GPX Merger</h3>
            <h5>Choose your situation</h5>
            <Row>
                <Col>
                    <Card {...cardStyle} onClick={() => setSelectedSection('gps')}>
                        <Card.Body>
                            <Card.Title>Start a new planning</Card.Title>
                            <Card.Text>Plan a moving demonstration with multiple branches</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Set parameters</ListGroup.Item>
                            <ListGroup.Item>Upload Gpx segments</ListGroup.Item>
                            <ListGroup.Item>Group segments into tracks</ListGroup.Item>
                            <ListGroup.Item>Resolve Street data</ListGroup.Item>
                            <ListGroup.Item>Download documents</ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
                <Col>
                    <Card {...cardStyle} onClick={() => setSelectedSection('importExport')}>
                        <Card.Body>
                            <Card.Title>Load an existing planning</Card.Title>
                            <Card.Text>Load an existing planning via json file</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card {...cardStyle} onClick={() => setSelectedSection('gps')}>
                        <Card.Body>
                            <Card.Title>Learn how to do a planning</Card.Title>
                            <Card.Text>Go through a sample planning of a demonstration with help</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
