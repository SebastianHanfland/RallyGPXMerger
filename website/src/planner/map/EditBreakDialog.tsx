import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { FormattedMessage } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getBreakEditInfo, getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { BreakDialogContent } from './BreakDialogContent.tsx';
import { useEffect, useState } from 'react';
import { BREAK, isTrackBreak, TrackBreak } from '../store/types.ts';
import { AppDispatch } from '../store/planningStore.ts';

export const EditBreakDialog = () => {
    const breakEditInfo = useSelector(getBreakEditInfo);
    const track = useSelector(getTrackCompositions).find(({ id }) => id === breakEditInfo?.trackId);
    const foundBreak = track?.segments.filter(isTrackBreak).find((element) => element.id === breakEditInfo?.breakId);

    const dispatch: AppDispatch = useDispatch();
    const [values, setValues] = useState<Partial<TrackBreak>>({
        minutes: foundBreak?.minutes,
        description: foundBreak?.description,
        hasToilet: foundBreak?.hasToilet,
    });

    const closeModal = () => {
        dispatch(trackMergeActions.setBreakEditInfo(undefined));
    };

    const addBreak = () => {
        if (!track || !values.minutes) {
            return;
        }
        const segments = track.segments.map((element) =>
            element.id !== breakEditInfo?.breakId
                ? element
                : {
                      id: element.id,
                      type: BREAK,
                      minutes: values.minutes ?? 0,
                      description: values.description ?? '',
                      hasToilet: values.hasToilet ?? false,
                  }
        );
        dispatch(trackMergeActions.setSegments({ id: track.id, segments: segments }));
        closeModal();
    };

    useEffect(() => {
        setValues({
            minutes: foundBreak?.minutes,
            description: foundBreak?.description,
            hasToilet: foundBreak?.hasToilet,
        });
    }, [breakEditInfo]);

    if (!breakEditInfo || !foundBreak) {
        return null;
    }

    return (
        <Modal show={true} onHide={closeModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={'msg.editBreak'} />
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
                    <FormattedMessage id={'msg.save'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
