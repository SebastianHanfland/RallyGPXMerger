import { useDispatch, useSelector } from 'react-redux';
import { getShowDashboard, layoutActions } from '../../store/layout.reducer.ts';
import { Container, Offcanvas, Row } from 'react-bootstrap';
import { ArrowColumn } from './ArrowColumn.tsx';
import { DashboardSettings } from './DashboardSettings.tsx';
import { DashboardSegments } from './DashboardSegments.tsx';
import { DashboardTracks } from './DashboardTracks.tsx';
import { DashboardCalculateTracks } from './DashboardCalculateTracks.tsx';
import { DashboardStreets } from './DashboardStreets.tsx';
import { ExportStateJson } from '../../io/ExportStateJson.tsx';
import { DashboardDocuments } from './DashboardDocuments.tsx';
import { FormattedMessage, useIntl } from 'react-intl';

export function Dashboard() {
    const show = useSelector(getShowDashboard);
    const dispatch = useDispatch();
    const intl = useIntl();
    const onHide = () => dispatch(layoutActions.setShowDashboard(false));
    return (
        <Offcanvas show={show} onHide={onHide} backdropClassName={'static'}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                    <FormattedMessage id={'msg.dashboard'} />
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Container>
                    <DashboardSettings />
                    <ArrowColumn />
                    <DashboardSegments />
                    <ArrowColumn />
                    <DashboardTracks />
                    <ArrowColumn />
                    <DashboardCalculateTracks />
                    <ArrowColumn />
                    <DashboardStreets />
                    <ArrowColumn />
                    <DashboardDocuments />
                    <hr />
                    <Row>
                        <ExportStateJson label={intl.formatMessage({ id: 'msg.downloadPlanning' })} />
                    </Row>
                </Container>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
