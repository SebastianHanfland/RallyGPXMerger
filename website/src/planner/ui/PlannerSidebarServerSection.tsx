import { UploadDataButton } from '../layout/UploadDataButton.tsx';
import { RemoveUploadedDataButton } from '../layout/RemoveUploadedDataButton.tsx';
import { PasswordButton } from '../layout/PasswordButton.tsx';
import { SharePlanningButton } from '../layout/SharePlanningButton.tsx';
import { CleanDataButton } from '../layout/CleanDataButton.tsx';
import { DownloadDataButton } from '../layout/DownloadDataButton.tsx';
import { Col, Row } from 'react-bootstrap';
import { SegmentFilesDownloader } from '../segments/SegmentFilesDownloader.tsx';
import { CalculatedFilesDownloader } from '../tracks/CalculatedFilesDownloader.tsx';
import { StreetFilesDownloader } from '../streets/StreetFilesDownloader.tsx';
import { StreetFilesPdfMakeDownloader } from '../streets/StreetFilesPdfMakeDownloader.tsx';

export const PlannerSidebarServerSection = () => {
    return (
        <div>
            <Row>
                <Col></Col>
            </Row>
            <Row>
                <Col>
                    <Row>
                        <h5>Daten auf dem Server</h5>
                    </Row>

                    <Row>
                        <UploadDataButton />
                    </Row>
                    <Row>
                        <PasswordButton />
                    </Row>
                    <Row>
                        <RemoveUploadedDataButton />
                    </Row>
                    <Row>
                        <SharePlanningButton />
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <h5>Lokale Daten</h5>
                    </Row>
                    <Row>
                        <DownloadDataButton />
                    </Row>
                    <Row>
                        <CleanDataButton />
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                <SegmentFilesDownloader />
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <CalculatedFilesDownloader />
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Row>
                                <StreetFilesDownloader />
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <StreetFilesPdfMakeDownloader />
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};
