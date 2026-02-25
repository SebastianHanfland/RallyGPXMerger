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

export function EditPostCodeButton(props: Props) {
    const { waypoint } = props;

    const [showModal, setShowModal] = useState(false);
    if (waypoint.postCode === '') {
        return null;
    }

    return (
        <>
            <span onClick={() => setShowModal(true)}>
                <EditIcon />
            </span>
            {showModal && <EditPostCodeModal waypoint={waypoint} closeModal={() => setShowModal(false)} />}
        </>
    );
}

export function EditPostCodeModal(props: Props & { closeModal: () => void }) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const { waypoint, closeModal } = props;

    const [postCode, setPostCode] = useState(waypoint.postCode ?? '');

    const onConfirm = () => {
        dispatch(segmentDataActions.addReplacePostCodeLookup({ [waypoint.s ?? -1]: postCode }));
        closeModal();
    };

    return (
        <Modal show={true} onHide={closeModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.changePostCode'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id={'msg.postCode'} />
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={intl.formatMessage({ id: 'msg.postCode' })}
                        value={postCode ?? ''}
                        onChange={(value) => setPostCode(value.target.value)}
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
