import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getEntryPointEditInfo, getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { EntryPointDialogContent } from './EntryPointDialogContent.tsx';
import { useEffect, useState } from 'react';
import { ENTRY, isTrackEntryPoint, TrackEntry } from '../store/types.ts';
import { AppDispatch } from '../store/planningStore.ts';

export const EditEntryPointDialog = () => {
    const entryPointEditInfo = useSelector(getEntryPointEditInfo);
    const track = useSelector(getTrackCompositions).find(({ id }) => id === entryPointEditInfo?.trackId);
    const foundEntryPoint = track?.segments
        .filter(isTrackEntryPoint)
        .find((element) => element.id === entryPointEditInfo?.entryPointId);

    const dispatch: AppDispatch = useDispatch();
    const [values, setValues] = useState<Partial<TrackEntry>>({
        streetName: foundEntryPoint?.streetName,
        buffer: foundEntryPoint?.buffer,
        rounding: foundEntryPoint?.rounding,
        extraInfo: foundEntryPoint?.extraInfo,
    });

    const closeModal = () => {
        dispatch(trackMergeActions.setEntryPointEditInfo(undefined));
    };

    const saveEntryPoint = () => {
        const streetName = values?.streetName;
        if (!track || !streetName) {
            return;
        }
        const segments = track.segments.map((element) =>
            element.id !== entryPointEditInfo?.entryPointId
                ? element
                : {
                      id: element.id,
                      type: ENTRY,
                      streetName: streetName,
                      buffer: values?.buffer,
                      rounding: values?.rounding,
                      extraInfo: values?.extraInfo,
                  }
        );
        dispatch(trackMergeActions.setSegments({ id: track.id, segments: segments }));
        closeModal();
    };

    useEffect(() => {
        setValues({
            streetName: foundEntryPoint?.streetName,
            buffer: foundEntryPoint?.buffer,
            rounding: foundEntryPoint?.rounding,
            extraInfo: foundEntryPoint?.extraInfo,
        });
    }, [entryPointEditInfo]);

    if (!entryPointEditInfo || !foundEntryPoint) {
        return null;
    }

    return (
        <Modal show={true} onHide={closeModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.editEntryPoint'} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <EntryPointDialogContent values={values} setValues={setValues} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    <FormattedMessage id={'msg.close'} />
                </Button>
                <Button variant="primary" onClick={saveEntryPoint} disabled={!values.streetName}>
                    <FormattedMessage id={'msg.save'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
