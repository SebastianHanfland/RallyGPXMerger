import { useDispatch, useSelector } from 'react-redux';
import { getShowDashboard, layoutActions } from '../store/layout.reducer.ts';
import { Card, Col, Container, Offcanvas, Row } from 'react-bootstrap';

function DashboardCard({ text, done, canBeDone }: { text: string; done: boolean; canBeDone: boolean }) {
    return (
        <Card
            style={{ cursor: 'pointer', backgroundColor: done ? 'lightgreen' : canBeDone ? undefined : 'lightsalmon' }}
            className={'startPageCard shadow m-2'}
        >
            {text}
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
                            <DashboardCard text={'Settings'} done={true} canBeDone={true} />
                        </Col>
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
                        <Col>
                            <DashboardCard text={'Tracks Merging'} done={false} canBeDone={true} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DashboardCard text={'Street info'} done={false} canBeDone={false} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DashboardCard text={'Street grouping'} done={false} canBeDone={false} />
                        </Col>
                        <Col>
                            <DashboardCard text={'Post codes'} done={false} canBeDone={false} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DashboardCard text={'Documents'} done={false} canBeDone={false} />
                        </Col>
                    </Row>
                </Container>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
