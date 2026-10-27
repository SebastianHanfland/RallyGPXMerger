import { Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { UploadDataButton } from './UploadDataButton';
import { PasswordButton } from './PasswordButton';
import { SharePlanningButton } from '../sharing/SharePlanningButton';
import { RemoveUploadedDataButton } from './RemoveUploadedDataButton';
import { DownloadDataButton } from './DownloadDataButton';
import { SegmentFilesDownloader } from '../download/gpx/SegmentFilesDownloader';
import { CalculatedFilesDownloader } from '../download/gpx/CalculatedFilesDownloader';
import { StreetFilesDownloader } from '../streets/StreetFilesDownloader';
import { CleanDataButton } from './CleanDataButton';
import { DownloadDataForCopyButton } from './DownloadDataForCopyButton';
import { BlockedStreetsPdfDownloadButton } from '../download/pdf/blockedstreets/BlockedStreetsPdfDownloadButton';
import { PdfDocumentInZipButton } from '../download/pdf/PdfDocumentInZip';

export const PlannerSidebarServerSection = () => {
    const className = 'm-1';
    return (
        <div>
            <Row>
                <Col className={className}>
                    <Row>
                        <h5>
                            <FormattedMessage id={'msg.serverData'} />
                        </h5>
                    </Row>

                    <Row className={className}>
                        <UploadDataButton />
                    </Row>

                    <Row className={className}>
                        <PasswordButton />
                    </Row>
                    <Row className={className}>
                        <SharePlanningButton />
                    </Row>
                    <Row className={className}>
                        <RemoveUploadedDataButton />
                    </Row>
                </Col>
                <Col className={className}>
                    <Row>
                        <h5>
                            <FormattedMessage id={'msg.localData'} />
                        </h5>
                    </Row>
                    <Row className={className}>
                        <DownloadDataButton />
                    </Row>
                    <Row className={className}>
                        <DownloadDataForCopyButton />
                    </Row>

                    <Row className={className}>
                        <Col>
                            <Row style={{ marginRight: '1px' }}>
                                <SegmentFilesDownloader />
                            </Row>
                        </Col>
                        <Col>
                            <Row style={{ marginLeft: '1px' }}>
                                <CalculatedFilesDownloader />
                            </Row>
                        </Col>
                    </Row>
                    <Row className={className}>
                        <Col>
                            <Row style={{ marginRight: '1px' }}>
                                <StreetFilesDownloader />
                            </Row>
                        </Col>
                        <Col>
                            <Row style={{ marginLeft: '1px' }}>
                                <PdfDocumentInZipButton />
                            </Row>
                        </Col>
                    </Row>
                    <Row className={className}>
                        <BlockedStreetsPdfDownloadButton />
                    </Row>
                    <Row className={className}>
                        <CleanDataButton />
                    </Row>
                </Col>
            </Row>
        </div>
    );
};
