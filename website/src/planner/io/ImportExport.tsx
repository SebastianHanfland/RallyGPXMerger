import { Button, Col, Row } from 'react-bootstrap';
import upload from '../../assets/file-up.svg';
import { FileDownloader } from '../segments/FileDownloader.tsx';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { FileUploader } from 'react-drag-drop-files';
import { storage } from '../store/storage.ts';
import { gpxShortener } from './gpxShortener.ts';
import { SegmentFilesDownloader } from '../segments/SegmentFilesDownloader.tsx';
import { CalculatedFilesDownloader } from '../tracks/CalculatedFilesDownloader.tsx';
import { StreetFilesDownloader } from '../streets/StreetFilesDownloader.tsx';
import { StreetFilesPdfMakeDownloader } from '../streets/StreetFilesPdfMakeDownloader.tsx';

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
        const shortenedLoadedState = gpxShortener(loadedState);
        storage.save(JSON.parse(shortenedLoadedState));
        window.location.reload();
    };

    return (
        <div>
            <h3 className={'mb-5'}>Import and export the data</h3>
            <Row className="flex-xl-nowrap" style={{ height: '20vh', minHeight: '200px', width: '100%' }}>
                <Col xl={6}></Col>
                <Col xl={6}>
                    <div className={'d-flex justify-content-between'} style={{ width: '500px' }}>
                        <span title={!loadedState ? 'Please first upload a file ->' : ''}>
                            <Button variant={'success'} onClick={() => setShowDialog(true)} disabled={!loadedState}>
                                <img src={upload} className="m-1" alt="download file" color={'#ffffff'} />
                                Import file
                            </Button>
                        </span>
                        <FileUploader
                            style={{ width: '100px' }}
                            handleChange={handleChange}
                            name="file"
                            types={fileTypes}
                            multiple={false}
                            label={'Please upload a state file here'}
                        />
                    </div>
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
            <Row style={{ height: '50vh' }}>
                <Col>
                    <h4>Gpx Segments</h4>
                    <SegmentFilesDownloader />
                </Col>
                <Col>
                    <h4>Calculated Tracks</h4>
                    <CalculatedFilesDownloader />
                </Col>
                <Col>
                    <h4>Documents</h4>
                    <div className={'m-2'}>
                        <StreetFilesDownloader /> <StreetFilesPdfMakeDownloader />
                    </div>
                </Col>
                <Col>
                    <h4>Complete status</h4>
                    <FileDownloader
                        onlyIcon={true}
                        name={`RallyGPXMergeState-${new Date().toISOString()}.json`}
                        label={' Export current state to file'}
                        content={JSON.stringify(state)}
                        id={'state-down'}
                    />
                </Col>
            </Row>
        </div>
    );
}
