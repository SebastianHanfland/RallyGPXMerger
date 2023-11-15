import { Accordion, Button, Col, Row } from 'react-bootstrap';
import upload from '../../assets/file-up.svg';
import { FileDownloader } from '../segments/FileDownloader.tsx';
import { useSelector } from 'react-redux';

export function ImportExport() {
    const state = useSelector((a) => a);
    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Import and export the data</Accordion.Header>
                <Accordion.Body>
                    <Row className="flex-xl-nowrap" style={{ height: '40px', width: '100%' }}>
                        <Col xl={6}>
                            <FileDownloader
                                onlyIcon={true}
                                name={`RallyGPXMergeState-${new Date().toISOString()}.json`}
                                label={' Export current state to file'}
                                content={JSON.stringify(state)}
                                id={'state-down'}
                            />
                        </Col>
                        <Col xl={6}>
                            <Button variant={'success'}>
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
