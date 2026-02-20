import { UploadDataButton } from '../../layout/UploadDataButton.tsx';
import { RemoveUploadedDataButton } from '../../layout/RemoveUploadedDataButton.tsx';
import { PasswordButton } from '../../layout/PasswordButton.tsx';
import { SharePlanningButton } from '../../sharing/SharePlanningButton.tsx';
import { CleanDataButton } from '../../layout/CleanDataButton.tsx';
import { DownloadDataButton } from '../../layout/DownloadDataButton.tsx';
import { Col, Row } from 'react-bootstrap';
import { SegmentFilesDownloader } from '../../segments/SegmentFilesDownloader.tsx';
import { CalculatedFilesDownloader } from '../../tracks/CalculatedFilesDownloader.tsx';
import { StreetFilesDownloader } from '../../streets/StreetFilesDownloader.tsx';
import { StreetFilesPdfMakeDownloader } from '../../streets/StreetFilesPdfMakeDownloader.tsx';
import { FormattedMessage } from 'react-intl';

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
                                <StreetFilesPdfMakeDownloader />
                            </Row>
                        </Col>
                    </Row>
                    <Row className={className}>
                        <CleanDataButton />
                    </Row>
                </Col>
            </Row>
        </div>
    );
};
