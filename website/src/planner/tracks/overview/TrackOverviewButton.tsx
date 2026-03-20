import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { TrackOverviewContent } from './TrackOverviewContent.tsx';

export const TrackOverviewButton = () => {
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    return (
        <>
            <Button
                className={'mx-1 rounded-2'}
                variant={'info'}
                onClick={() => setOpen(true)}
                style={{ width: '190px' }}
            >
                <span className={'mx-1'}>
                    <FormattedMessage id={'msg.trackOverview'} />
                </span>
            </Button>
            {open && (
                <Modal show={true} onHide={closeModal} backdrop="static" size={'xl'} fullscreen={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div>
                                <FormattedMessage id={'msg.tracks'} />
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
