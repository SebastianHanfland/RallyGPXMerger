import { TrackWayPoint, TrackWayPointType } from '../logic/resolving/types.ts';
import Button from 'react-bootstrap/Button';
import pencil from '../../assets/pencil.svg';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
    waypoint: TrackWayPoint;
    trackStreetInfoId: string;
}

export function EditStreetNameButton(props: Props) {
    const intl = useIntl();
    const { trackStreetInfoId, waypoint } = props;

    const [showModal, setShowModal] = useState(false);
    const [streetName, setStreetName] = useState(waypoint.streetName);

    if (waypoint.type !== TrackWayPointType.Track) {
        return null;
    }

    const closeModal = () => setShowModal(false);
    const onConfirm = () => {};

    return (
        <>
            <img
                src={pencil}
                className="m-1"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowModal(true)}
                alt="upload file"
                color={'#ffffff'}
            />
            {showModal && (
                <Modal show={true} onHide={closeModal} backdrop="static" keyboard={false} onEscapeKeyDown={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FormattedMessage id={'msg.changeStreetName'} />
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>
                                <FormattedMessage id={'msg.street'} />
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={intl.formatMessage({ id: 'msg.street' })}
                                value={streetName ?? ''}
                                onChange={(value) => setStreetName(value.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            <FormattedMessage id={'msg.close'} />
                        </Button>
                        <Button variant="primary" onClick={onConfirm}>
                            <FormattedMessage id={'msg.confirm'} />
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}
