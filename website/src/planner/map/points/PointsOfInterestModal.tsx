import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getContextMenuPoint, pointsActions } from '../../store/points.reducer.ts';

export function PointsOfInterestModal() {
    const dispatch = useDispatch();
    const hasMarkedPoint = !!useSelector(getContextMenuPoint);
    const closeModal = () => {
        dispatch(pointsActions.setContextMenuPoint(undefined));
    };
    const savePoint = () => {};
    return (
        <Modal show={hasMarkedPoint} onHide={closeModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.pointOfInterest'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{'Fields here'}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
                <Button variant="primary" onClick={savePoint}>
                    <FormattedMessage id={'msg.confirm'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
