import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getTrackCompositions, getTrackIdForAddingABreak, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { BreakDialogContent } from './BreakDialogContent.tsx';
import { useEffect, useState } from 'react';
import { BREAK, TrackBreak } from '../store/types.ts';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../store/planningStore.ts';

export const CreateBreakDialog = () => {
    const trackIdForBreak = useSelector(getTrackIdForAddingABreak);
    const track = useSelector(getTrackCompositions).find(({ id }) => id === trackIdForBreak);
    const dispatch: AppDispatch = useDispatch();
    const [values, setValues] = useState<Partial<TrackBreak>>({});

    const closeModal = () => {
        dispatch(trackMergeActions.setTrackIdForAddingABreak(undefined));
    };

    const addBreak = () => {
        if (!track || !values.minutes) {
            return;
        }
        const segments = [
            ...track.segments,
            {
                id: uuidv4(),
                type: BREAK,
                minutes: values.minutes,
                description: values.description ?? '',
                hasToilet: values.hasToilet ?? false,
            },
        ];
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
        <Modal show={true} onHide={closeModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.break'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BreakDialogContent values={values} setValues={setValues} />
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
