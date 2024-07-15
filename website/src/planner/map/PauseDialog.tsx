import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getTrackIdForAddingABreak, trackMergeActions } from '../store/trackMerge.reducer.ts';

export const PauseDialog = () => {
    const trackIdForBreak = useSelector(getTrackIdForAddingABreak);
    const dispatch = useDispatch();

    const closeModal = () => {
        dispatch(trackMergeActions.setTrackIdForAddingABreak(undefined));
    };

    if (!trackIdForBreak) {
        return null;
    }

    return (
        <Modal show={true} onHide={closeModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.pause'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>Dummy Content</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
