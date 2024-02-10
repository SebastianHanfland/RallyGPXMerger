import { Button } from 'react-bootstrap';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { TrackMergeParameters } from '../parameters/TrackMergeParameters.tsx';
import { useDispatch } from 'react-redux';
import { calculateMerge } from '../logic/merge/MergeCalculation.ts';
import { AppDispatch } from '../store/store.ts';
import { FormattedMessage } from 'react-intl';

export function TrackCalculationSettings() {
    const [showModal, setShowModal] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    return (
        <>
            <Button variant={'info'} onClick={() => setShowModal(true)}>
                <FormattedMessage id={'msg.calculationSettings.title'} />
            </Button>
            {showModal && (
                <Modal show={true} onHide={() => setShowModal(false)} backdrop="static" keyboard={false} size={'lg'}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <FormattedMessage id={'msg.calculationSettings.title'} />
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <TrackMergeParameters />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            <FormattedMessage id={'msg.close'} />
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                dispatch(calculateMerge);
                                setShowModal(false);
                            }}
                        >
                            <FormattedMessage id={'msg.confirm'} />
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}
