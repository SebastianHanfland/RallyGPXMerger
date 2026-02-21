import { AggregatedPoints } from '../logic/resolving/types.ts';
import Button from 'react-bootstrap/Button';
import pencil from '../../assets/pencil.svg';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/planningStore.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';

interface Props {
    waypoint: AggregatedPoints;
}

export function EditStreetNameButton(props: Props) {
    const { waypoint } = props;

    const [showModal, setShowModal] = useState(false);

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
            {showModal && <EditStreetNameModal waypoint={waypoint} closeModal={() => setShowModal(false)} />}
        </>
    );
}

export function EditStreetNameModal(props: Props & { closeModal: () => void }) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const { waypoint, closeModal } = props;

    const [streetName, setStreetName] = useState(waypoint.streetName ?? '');

    const onConfirm = () => {
        dispatch(segmentDataActions.addReplaceStreetLookup({ [waypoint.s ?? -1]: streetName }));
        closeModal();
    };

    return (
        <Modal show={true} onHide={closeModal} backdrop="static">
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
    );
}
