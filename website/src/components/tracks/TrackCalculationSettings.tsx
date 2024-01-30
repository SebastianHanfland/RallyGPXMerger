import { Button } from 'react-bootstrap';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { TrackMergeSection } from '../parameters/TrackMergeSection.tsx';
import { useDispatch } from 'react-redux';
import { calculateMerge } from '../../logic/MergeCalculation.ts';
import { AppDispatch } from '../../planner/store/store.ts';

export function TrackCalculationSettings() {
    const [showModal, setShowModal] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    return (
        <>
            <Button variant={'info'} onClick={() => setShowModal(true)}>
                Calculation settings
            </Button>
            {showModal && (
                <Modal show={true} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Calculation settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <TrackMergeSection />
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
