import { Button, Modal } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { PlannerSidebarSimpleSettings } from './PlannerSidebarSimpleSettings';

interface Props {
    onHide: () => void;
}

export function SimpleSettingsModal({ onHide }: Props) {
    return (
        <Modal show={true} onHide={onHide} size={'lg'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.settings'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PlannerSidebarSimpleSettings />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
