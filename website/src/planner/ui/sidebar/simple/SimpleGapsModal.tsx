import { Button, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { GapOverview } from '../../../points/GapOverview.tsx';

interface Props {
    onHide: () => void;
}

export function SimpleGapsModal({ onHide }: Props) {
    return (
        <Modal show={true} onHide={onHide} size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.gaps'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <GapOverview />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
