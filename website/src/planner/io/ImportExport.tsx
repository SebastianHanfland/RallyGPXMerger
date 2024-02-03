import { Button, Col, Row } from 'react-bootstrap';
import upload from '../../assets/file-up.svg';
import { SegmentFilesDownloader } from '../segments/SegmentFilesDownloader.tsx';
import { CalculatedFilesDownloader } from '../tracks/CalculatedFilesDownloader.tsx';
import { StreetFilesDownloader } from '../streets/StreetFilesDownloader.tsx';
import { StreetFilesPdfMakeDownloader } from '../streets/StreetFilesPdfMakeDownloader.tsx';
import { ExportStateJson } from './ExportStateJson.tsx';
import { importHook } from './importHook.ts';
import { Warning } from '../layout/dashboard/Warning.tsx';

export function ImportExport() {
    const { uploadInput, importButtonClicked, changeHandler } = importHook();

    return (
        <div>
            <Row>
                <h3 className={'mb-5'}>Import</h3>
            </Row>
            <Row className="flex-xl-nowrap" style={{ height: '20vh', minHeight: '200px', width: '100%' }}>
                <Col>
                    <div className={'d-flex justify-content-center'}>
                        <div>
                            <div className={'m-3'}>
                                All current data is lost when importing another file
                                <Warning />
                            </div>
                            <Button variant={'success'} onClick={importButtonClicked}>
                                <img src={upload} className="m-1" alt="upload file" color={'#ffffff'} />
                                Import file
                            </Button>
                        </div>
                    </div>
                    <input
                        type="file"
                        name="file"
                        onChange={changeHandler}
                        ref={uploadInput}
                        hidden={true}
                        accept={'application/json'}
                    />
                </Col>
            </Row>
            <hr />
            <Row>
                <h3>Downloads</h3>
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
                    <ExportStateJson label={'Export current state to file'} />
                </Col>
            </Row>
        </div>
    );
}
