import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { ConfirmationModal } from '../../../../../../common/ConfirmationModal';
import { EditIcon } from '../../../../../../utils/icons/EditIcon';
import { TrashIcon } from '../../../../../../utils/icons/TrashIcon';
import { AppDispatch } from '../../../../../store/planningStore';
import { trackMergeActions } from '../../../../../store/trackMerge.reducer';
import { TrackComposition, TrackEntry } from '../../../../../store/types';
import { EntryPointDescriptionModal } from './EntryPointDescriptionModal';

interface Props {
    track: TrackComposition;
    entryPoint: TrackEntry;
}

export const EntryPointButtons = ({ track, entryPoint }: Props) => {
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <>
            <Button
                variant="link"
                size="sm"
                title={intl.formatMessage({ id: 'msg.editEntryPointDescription' })}
                aria-label={intl.formatMessage({ id: 'msg.editEntryPointDescription' })}
                onClick={() => setShowDescriptionModal(true)}
            >
                <EditIcon />
            </Button>
            <Button
                variant="link"
                size="sm"
                title={intl.formatMessage({ id: 'msg.removeEntryPoint' })}
                aria-label={intl.formatMessage({ id: 'msg.removeEntryPoint' })}
                onClick={() => setShowDeleteModal(true)}
            >
                <TrashIcon />
            </Button>
            {showDescriptionModal && (
                <EntryPointDescriptionModal
                    track={track}
                    entryPoint={entryPoint}
                    closeModal={() => setShowDescriptionModal(false)}
                />
            )}
            {showDeleteModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        dispatch(trackMergeActions.removeSegmentFromTrack({ id: track.id, segmentId: entryPoint.id }));
                        setShowDeleteModal(false);
                    }}
                    closeModal={() => setShowDeleteModal(false)}
                    title={intl.formatMessage({ id: 'msg.removeEntryPointModalTitle' })}
                    body={intl.formatMessage({ id: 'msg.removeEntryPointModalBody' }, { name: entryPoint.streetName })}
                />
            )}
        </>
    );
};
