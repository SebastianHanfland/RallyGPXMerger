import { Button, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { PointsOfInterest } from '../../../../points/PointsOfInterest';

interface Props {
    onHide: () => void;
}

export function SimplePointsModal({ onHide }: Props) {
    return (
        <Modal show={true} onHide={onHide} size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.pointsOfInterest'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PointsOfInterest onNavigateToPoint={onHide} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
