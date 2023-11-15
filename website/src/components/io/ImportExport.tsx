import { Accordion, Button, Col, Row } from 'react-bootstrap';
import download from '../../assets/file-down.svg';
import upload from '../../assets/file-up.svg';

export function ImportExport() {
    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Import and export the data</Accordion.Header>
                <Accordion.Body>
                    <Row className="flex-xl-nowrap" style={{ height: '40px', width: '100%' }}>
                        <Col xl={6}>
                            <Button variant={'success'}>
                                <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
                                Export to file
                            </Button>
                        </Col>
                        <Col xl={6}>
                            <Button variant={'primary'}>
                                <img src={upload} className="m-1" alt="download file" color={'#ffffff'} />
                                Import file
                            </Button>
                        </Col>
                    </Row>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
