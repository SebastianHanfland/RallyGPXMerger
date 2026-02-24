import { FormattedMessage } from 'react-intl';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { BlockedStreetsModalContent } from './BlockedStreetsModalContent.tsx';

interface Props {
    onHide: () => void;
}

export const BlockedStreetsModal = ({ onHide }: Props) => {
    return (
        <Modal show={true} onHide={onHide} backdrop="static" size={'xl'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.blockedStreets'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BlockedStreetsModalContent />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
