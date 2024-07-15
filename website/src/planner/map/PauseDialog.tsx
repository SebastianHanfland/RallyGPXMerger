import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getTrackCompositions, getTrackIdForAddingABreak, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { PauseDialogContent } from './PauseDialogContent.tsx';
import { useEffect, useState } from 'react';
import { TrackPause } from '../store/types.ts';
import { BREAK_IDENTIFIER } from '../logic/merge/types.ts';
import { v4 as uuidv4 } from 'uuid';

export const PauseDialog = () => {
    const trackIdForBreak = useSelector(getTrackIdForAddingABreak);
    const track = useSelector(getTrackCompositions).find(({ id }) => id === trackIdForBreak);
    const dispatch = useDispatch();
    const [values, setValues] = useState<Partial<TrackPause>>({});

    const closeModal = () => {
        dispatch(trackMergeActions.setTrackIdForAddingABreak(undefined));
    };

    const addBreak = () => {
        if (!track || !values.minutes) {
            return;
        }
        const segments = [...track.segmentIds, `${values.minutes}${BREAK_IDENTIFIER}${uuidv4()}`];
        dispatch(trackMergeActions.setSegments({ id: track.id, segments: segments }));
        closeModal();
    };

    useEffect(() => {
        setValues({});
    }, [trackIdForBreak]);

    if (!trackIdForBreak) {
        return null;
    }

    return (
        <Modal show={true} onHide={closeModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.pause'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PauseDialogContent values={values} setValues={setValues} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
                <Button variant="primary" onClick={addBreak} disabled={!values.minutes}>
                    <FormattedMessage id={'msg.add'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
