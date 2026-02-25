import { WayPoint } from '../logic/resolving/types.ts';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/planningStore.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { EditIcon } from '../../utils/icons/EditIcon.tsx';

interface Props {
    waypoint: WayPoint;
}

export function EditDistrictButton(props: Props) {
    const { waypoint } = props;

    const [showModal, setShowModal] = useState(false);
    if (waypoint.district === '') {
        return null;
    }

    return (
        <>
            <span onClick={() => setShowModal(true)}>
                <EditIcon />
            </span>
            {showModal && <EditDistrictModal waypoint={waypoint} closeModal={() => setShowModal(false)} />}
        </>
    );
}

export function EditDistrictModal(props: Props & { closeModal: () => void }) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const { waypoint, closeModal } = props;

    const [district, setDistrict] = useState(waypoint.district ?? '');

    const onConfirm = () => {
        dispatch(segmentDataActions.addReplaceDistrictLookup({ [waypoint.s ?? -1]: district }));
        closeModal();
    };

    return (
        <Modal show={true} onHide={closeModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.changeDistrict'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id={'msg.district'} />
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={intl.formatMessage({ id: 'msg.district' })}
                        value={district ?? ''}
                        onChange={(value) => setDistrict(value.target.value)}
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
