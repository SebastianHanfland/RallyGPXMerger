import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import {
    getTrackCompositions,
    getTrackIdForAddingAnEntryPoint,
    trackMergeActions,
} from '../store/trackMerge.reducer.ts';
import { EntryPointDialogContent } from './EntryPointDialogContent.tsx';
import { useEffect, useState } from 'react';
import { ENTRY, TrackEntry } from '../store/types.ts';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../store/planningStore.ts';

export const CreateEntryPointDialog = () => {
    const trackIdForEntryPoint = useSelector(getTrackIdForAddingAnEntryPoint);
    const track = useSelector(getTrackCompositions).find(({ id }) => id === trackIdForEntryPoint);
    const dispatch: AppDispatch = useDispatch();
    const [values, setValues] = useState<Partial<TrackEntry>>({});

    const closeModal = () => {
        dispatch(trackMergeActions.setTrackIdForEntryPoint(undefined));
    };

    const addEntryPoint = () => {
        if (!track || !values.streetName) {
            return;
        }
        const newEntryPoint: TrackEntry = {
            id: uuidv4(),
            type: ENTRY,
            streetName: values.streetName,
            extraInfo: values.extraInfo,
            buffer: values.buffer,
            rounding: values.rounding,
        };
        const segments = [newEntryPoint, ...track.segments];
        dispatch(trackMergeActions.setSegments({ id: track.id, segments: segments }));
        closeModal();
    };

    useEffect(() => {
        setValues({});
    }, [trackIdForEntryPoint]);

    if (!trackIdForEntryPoint) {
        return null;
    }

    return (
        <Modal show={true} onHide={closeModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.addEntryPoint'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <EntryPointDialogContent values={values} setValues={setValues} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
                <Button variant="primary" onClick={addEntryPoint} disabled={!values.streetName}>
                    <FormattedMessage id={'msg.add'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
