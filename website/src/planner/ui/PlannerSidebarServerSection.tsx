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
                <Col>
                    <h5>
                        Daten auf dem Server
                        <PasswordButton />
                    </h5>
                </Col>
            </Row>
            <Row>
                <Col>
                    <UploadDataButton />
                </Col>
                <Col>
                    <RemoveUploadedDataButton />
                </Col>
                <Col>
                    <SharePlanningButton />
                </Col>
            </Row>
            <Row>
                <h5>Lokale Daten</h5>
            </Row>
            <Row>
                <Col>
                    <DownloadDataButton />
                </Col>
                <Col>
                    <CleanDataButton />
                </Col>
            </Row>
            <Row className={'mt-3'}>
                <Col>
                    <SegmentFilesDownloader />
                </Col>
                <Col>
                    <CalculatedFilesDownloader />
                </Col>
                <Col>
                    <div>
                        <StreetFilesDownloader /> <StreetFilesPdfMakeDownloader />
                    </div>
                </Col>
            </Row>
        </div>
    );
};
