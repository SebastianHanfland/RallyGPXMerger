import { Button } from 'react-bootstrap';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { TrackMergeParameters } from '../parameters/TrackMergeParameters.tsx';
import { useDispatch } from 'react-redux';
import { calculateMerge } from '../logic/merge/MergeCalculation.ts';
import { AppDispatch } from '../store/store.ts';

export function TrackCalculationSettings() {
    const [showModal, setShowModal] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    return (
        <>
            <Button variant={'info'} onClick={() => setShowModal(true)}>
                Calculation settings
            </Button>
            {showModal && (
                <Modal show={true} onHide={() => setShowModal(false)} backdrop="static" keyboard={false} size={'lg'}>
                    <Modal.Header closeButton>
                        <Modal.Title>Calculation settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <TrackMergeParameters />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                dispatch(calculateMerge);
                                setShowModal(false);
                            }}
                        >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}
