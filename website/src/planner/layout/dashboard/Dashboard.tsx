import { useDispatch, useSelector } from 'react-redux';
import { getShowDashboard, layoutActions } from '../../store/layout.reducer.ts';
import { Container, Offcanvas, Row } from 'react-bootstrap';
import { ArrowColumn } from './ArrowColumn.tsx';
import { DashboardSettings } from './DashboardSettings.tsx';
import { DashboardSegments } from './DashboardSegments.tsx';
import { DashboardTracks } from './DashboardTracks.tsx';
import { DashboardMerging } from './DashboardMerging.tsx';
import { DashboardStreets } from './DashboardStreets.tsx';
import { ExportStateJson } from '../../io/ExportStateJson.tsx';
import { DashboardDocuments } from './DashboardDocuments.tsx';

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
