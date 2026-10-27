import { Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { ConfirmationModal } from '../../../../../../common/ConfirmationModal';
import { AppDispatch } from '../../../../../store/planningStore';
import { trackMergeActions } from '../../../../../store/trackMerge.reducer';
import { TrackComposition, TrackEntry } from '../../../../../store/types';

interface Props {
    track: TrackComposition;
    entryPoint: TrackEntry;
    closeModal: () => void;
}

export const EntryPointDescriptionModal = ({ track, entryPoint, closeModal }: Props) => {
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();
    const [description, setDescription] = useState(entryPoint.extraInfo ?? '');

    useEffect(() => setDescription(entryPoint.extraInfo ?? ''), [entryPoint]);

    return (
        <ConfirmationModal
            onConfirm={() => {
                dispatch(
                    trackMergeActions.updateEntryPoint({
                        trackId: track.id,
                        entryPointId: entryPoint.id,
                        values: { extraInfo: description || undefined },
                    })
                );
                closeModal();
            }}
            closeModal={closeModal}
            title={intl.formatMessage({ id: 'msg.editEntryPointDescription' })}
            body={
                <Form.Control
                    as="textarea"
                    rows={3}
                    aria-label={intl.formatMessage({ id: 'msg.description' })}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                />
            }
        />
    );
};
