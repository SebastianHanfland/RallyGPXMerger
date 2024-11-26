import { UploadDataButton } from '../layout/UploadDataButton.tsx';
import { RemoveUploadedDataButton } from '../layout/RemoveUploadedDataButton.tsx';
import { PasswordButton } from '../layout/PasswordButton.tsx';
import { SharePlanningButton } from '../layout/SharePlanningButton.tsx';
import { CleanDataButton } from '../layout/CleanDataButton.tsx';
import { DownloadDataButton } from '../layout/DownloadDataButton.tsx';
import { Col, Row } from 'react-bootstrap';

export const PlannerSidebarServerSection = () => {
    return (
        <div>
            <Row>
                <Col>
                    <UploadDataButton />
                    <RemoveUploadedDataButton />
                    <PasswordButton />
                </Col>
            </Row>
            <Row>
                <Col>
                    <SharePlanningButton />
                    <CleanDataButton />
                    <DownloadDataButton />
                </Col>
            </Row>
        </div>
    );
};
