import { Accordion, Button, Col, Row } from 'react-bootstrap';
import upload from '../../assets/file-up.svg';
import { FileDownloader } from '../segments/FileDownloader.tsx';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { ConfirmationModal } from '../ConfirmationModal.tsx';
import { FileUploader } from 'react-drag-drop-files';
import { storage } from '../../store/storage.ts';

const fileTypes = ['JSON'];

export function ImportExport() {
    const state = useSelector((a) => a);
    const [showDialog, setShowDialog] = useState(false);
    const [loadedState, setLoadedState] = useState<string>();

    const handleChange = (uploadedFile: File) => {
        uploadedFile.arrayBuffer().then((buffer) => setLoadedState(new TextDecoder().decode(buffer)));
    };

    const onLoadState = () => {
        if (!loadedState) {
            alert('You have to upload a state file first');
            return;
        }
        storage.save(JSON.parse(loadedState));
        window.location.reload();
    };

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
                            <FileUploader
                                handleChange={handleChange}
                                name="file"
                                types={fileTypes}
                                multiple={false}
                                label={'Please upload a state file here'}
                            />
                            <Button variant={'success'} onClick={() => setShowDialog(true)}>
                                <img src={upload} className="m-1" alt="download file" color={'#ffffff'} />
                                Import file
                            </Button>
                            {showDialog && (
                                <ConfirmationModal
                                    onConfirm={() => {
                                        setShowDialog(false);
                                        onLoadState();
                                    }}
                                    closeModal={() => setShowDialog(false)}
                                    title={'Importing data'}
                                    body={'Do you really want to load data from a file and OVERWRITE EVERYTHING?'}
                                />
                            )}
                        </Col>
                    </Row>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
