import { useDispatch, useSelector } from 'react-redux';
import { getShowDashboard, layoutActions } from '../../store/layout.reducer.ts';
import { Card, Col, Container, Offcanvas, Row } from 'react-bootstrap';
import check from '../../../assets/check-circle.svg';
import warning from '../../../assets/warning.svg';
import { ReactNode } from 'react';
import { ArrowColumn } from './ArrowColumn.tsx';
import { DashboardSettings } from './DashboardSettings.tsx';
import { DashboardSegments } from './DashboardSegments.tsx';
import { DashboardTracks } from './DashboardTracks.tsx';
import { DashboardMerging } from './DashboardMerging.tsx';
import { DashboardStreets } from './DashboardStreets.tsx';
import { ExportStateJson } from '../../io/ExportStateJson.tsx';
import { DashboardDocuments } from './DashboardDocuments.tsx';

export function DashboardCard({
    text,
    done,
    canBeDone,
    onClick,
    children,
    childrenOnly,
}: {
    text: string;
    done: boolean;
    canBeDone: boolean;
    onClick?: () => void;
    children?: ReactNode;
    childrenOnly?: boolean;
}) {
    return (
        <Row>
            <Col>
                <Card
                    style={{
                        cursor: 'pointer',
                        backgroundColor: done ? 'lightgreen' : canBeDone ? undefined : 'lightsalmon',
                    }}
                    className={'startPageCard shadow m-2 p-3'}
                    onClick={onClick}
                >
                    {!childrenOnly && (
                        <div className={'d-flex justify-content-between'}>
                            {text}
                            {done && (
                                <img
                                    src={check}
                                    className="m-1"
                                    alt="check"
                                    style={{ width: '20px', height: '20px' }}
                                />
                            )}
                            {!done && !canBeDone && (
                                <img
                                    src={warning}
                                    className="m-1"
                                    alt="warning"
                                    style={{ width: '20px', height: '20px' }}
                                />
                            )}
                            {children && children}
                        </div>
                    )}
                    {childrenOnly && children && children}
                </Card>
            </Col>
        </Row>
    );
}

export function Dashboard() {
    const show = useSelector(getShowDashboard);
    const dispatch = useDispatch();
    const onHide = () => dispatch(layoutActions.setShowDashboard(false));
    return (
        <Offcanvas show={show} onHide={onHide} backdropClassName={'static'}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Dashboard</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Container>
                    <DashboardSettings />
                    <ArrowColumn />
                    <DashboardSegments />
                    <ArrowColumn />
                    <DashboardTracks />
                    <ArrowColumn />
                    <DashboardMerging />
                    <ArrowColumn />
                    <DashboardStreets />
                    <ArrowColumn />
                    <DashboardDocuments />
                    <hr />
                    <Row>
                        <ExportStateJson label={'Download current planning'} />
                    </Row>
                </Container>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
