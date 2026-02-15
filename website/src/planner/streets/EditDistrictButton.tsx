import { AggregatedPoints } from '../logic/resolving/types.ts';
import Button from 'react-bootstrap/Button';
import pencil from '../../assets/pencil.svg';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { geoCodingActions } from '../store/geoCoding.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';

interface Props {
    waypoint: AggregatedPoints;
}

export function EditDistrictButton(props: Props) {
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
        dispatch(geoCodingActions.setDistrictReplacementWaypoint({ ...waypoint, district: district }));
        // dispatch(triggerAutomaticCalculation);
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
