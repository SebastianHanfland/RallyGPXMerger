import { useDispatch, useSelector } from 'react-redux';
import { getShowDashboard, layoutActions } from '../store/layout.reducer.ts';
import { Offcanvas } from 'react-bootstrap';

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
                {/*<Col xl={6}>*/}
                Hello world
                {/*</Col>*/}
            </Offcanvas.Body>
        </Offcanvas>
    );
}
