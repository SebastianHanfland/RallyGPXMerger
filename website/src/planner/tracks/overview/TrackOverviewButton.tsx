import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { TrackOverviewContent } from './TrackOverviewContent.tsx';
import { NodeIcon } from '../../../utils/icons/NodeIcon.tsx';

export const TrackOverviewButton = () => {
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    return (
        <>
            <Button className={'mx-1 rounded-2 p-0'} variant={'info'} onClick={() => setOpen(true)}>
                <span className={'mx-1'}>
                    <FormattedMessage id={'msg.nodesOverview'} />
                    <NodeIcon />
                </span>
            </Button>
            {open && (
                <Modal show={true} onHide={closeModal} backdrop="static" size={'xl'}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div>
                                <FormattedMessage id={'msg.nodes'} />
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <TrackOverviewContent />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            <FormattedMessage id={'msg.close'} />
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};
