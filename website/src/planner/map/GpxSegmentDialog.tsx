import { useDispatch, useSelector } from 'react-redux';
import { getClickOnSegment, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { GpxSegmentContent } from './GpxSegmentContent.tsx';

export const GpxSegmentDialog = () => {
    const clickOnSegment = useSelector(getClickOnSegment);
    const dispatch = useDispatch();

    const closeModal = () => {
        dispatch(gpxSegmentsActions.setClickOnSegment(undefined));
    };

    if (!clickOnSegment) {
        return null;
    }

    return (
        <Modal show={true} onHide={closeModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.actionOnSegmentClick'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <GpxSegmentContent />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
