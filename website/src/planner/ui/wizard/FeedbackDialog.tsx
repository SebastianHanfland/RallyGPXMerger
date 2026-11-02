import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
    closeModal: () => void;
}

export const FeedbackDialog = ({ closeModal }: Props) => {
    const intl = useIntl();

    return (
        <Modal show={true} onHide={closeModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id="msg.feedback.modalTitle" />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    <FormattedMessage
                        id="msg.feedback.modalBody"
                        values={{
                            github: (chunks) => (
                                <a
                                    href="https://github.com/signup"
                                    target="_blank"
                                    rel="noreferrer"
                                    referrerPolicy="no-referrer"
                                >
                                    {chunks}
                                </a>
                            ),
                        }}
                    />
                </p>
                <p>
                    <FormattedMessage id="msg.feedback.issueTypes" />
                </p>
                <a
                    href="https://github.com/SebastianHanfland/RallyGPXMerger/issues/new"
                    target="_blank"
                    rel="noreferrer"
                    referrerPolicy="no-referrer"
                >
                    {intl.formatMessage({ id: 'msg.feedback.createIssue' })}
                </a>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id="msg.close" />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
