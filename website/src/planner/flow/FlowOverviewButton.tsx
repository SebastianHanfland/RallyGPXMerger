import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import { useState } from 'react';
import { ArrowRightIcon } from '../../utils/icons/ArrowRightIcon.tsx';
import { FlowOverviewContent } from './FlowOverviewContent.tsx';

export const FlowOverviewButton = () => {
    const [open, setOpen] = useState(false);
    const intl = useIntl();
    const title = intl.formatMessage({ id: 'msg.flowOverview' });

    return (
        <>
            <Button
                className="mx-1 rounded-2 p-0"
                variant="info"
                onClick={() => setOpen(true)}
                title={title}
                aria-label={title}
            >
                <span className="mx-1">
                    <FormattedMessage id="msg.flowOverview" />
                    <ArrowRightIcon />
                </span>
            </Button>
            {open && (
                <Modal show={true} onHide={() => setOpen(false)} backdrop="static" size="xl" fullscreen={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FormattedMessage id="msg.flowOverview.title" />
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FlowOverviewContent />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setOpen(false)}>
                            <FormattedMessage id="msg.close" />
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};
