import { useDispatch, useSelector } from 'react-redux';
import { getShowDashboard, layoutActions } from '../../store/layout.reducer.ts';
import { Card, Col, Container, Offcanvas, Row } from 'react-bootstrap';
import check from '../../../assets/check-circle.svg';
import warning from '../../../assets/warning.svg';
import { ReactNode } from 'react';
import { MergeTracksButton } from '../../tracks/MergeTracksButton.tsx';
import { ArrowColumn } from './ArrowColumn.tsx';
import { DashboardSettings } from './DashboardSettings.tsx';

export function DashboardCard({
    text,
    done,
    canBeDone,
    onClick,
    children,
}: {
    text: string;
    done: boolean;
    canBeDone: boolean;
    onClick?: () => void;
    children?: ReactNode;
}) {
    return (
        <Card
            style={{ cursor: 'pointer', backgroundColor: done ? 'lightgreen' : canBeDone ? undefined : 'lightsalmon' }}
            className={'startPageCard shadow m-2 p-3'}
            onClick={onClick}
        >
            <div className={'d-flex justify-content-between'}>
                {text}
                {done && <img src={check} className="m-1" alt="trash" style={{ width: '20px', height: '20px' }} />}
                {!done && !canBeDone && (
                    <img src={warning} className="m-1" alt="trash" style={{ width: '20px', height: '20px' }} />
                )}
                {children && children}
            </div>
            {/*{children && <div>{children}</div>}*/}
        </Card>
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
                    <Row>
                        <Col>
                            <DashboardSettings />
                        </Col>
                    </Row>
                    <Row>
                        <ArrowColumn />
                        <ArrowColumn />
                    </Row>
                    <Row>
                        <Col>
                            <DashboardCard text={'Segments'} done={true} canBeDone={true} />
                        </Col>

                        <Col>
                            <DashboardCard text={'Tracks'} done={true} canBeDone={true} />
                        </Col>
                    </Row>
                    <Row>
                        <ArrowColumn />
                        <ArrowColumn />
                    </Row>
                    <Row>
                        <Col>
                            <DashboardCard text={'Tracks Merging'} done={false} canBeDone={true}>
                                <MergeTracksButton />
                            </DashboardCard>
                        </Col>
                    </Row>
                    <Row>
                        <ArrowColumn />
                    </Row>
                    <Row>
                        <Col>
                            <DashboardCard text={'Street info'} done={false} canBeDone={false} />
                        </Col>
                    </Row>
                    <Row>
                        <ArrowColumn />
                        <ArrowColumn />
                    </Row>
                    <Row>
                        <Col>
                            <DashboardCard text={'Aggregation'} done={false} canBeDone={false} />
                        </Col>
                        <Col>
                            <DashboardCard text={'Post codes'} done={false} canBeDone={false} />
                        </Col>
                    </Row>
                    <Row>
                        <ArrowColumn />
                        <ArrowColumn />
                    </Row>
                    <Row>
                        <Col>
                            <DashboardCard
                                text={'Documents'}
                                done={false}
                                canBeDone={false}
                                onClick={() => {
                                    dispatch(layoutActions.selectSection('importExport'));
                                    dispatch(layoutActions.setShowDashboard(false));
                                }}
                            />
                        </Col>
                    </Row>
                </Container>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
