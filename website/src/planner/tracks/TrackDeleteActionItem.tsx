import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { TrackComposition } from '../store/types.ts';
import { TrashIcon } from '../../utils/icons/TrashIcon.tsx';

interface Props {
    track: TrackComposition;
    onAction?: () => void;
}

export function TrackDeleteActionItem({ track, onAction }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const { id } = track;
    const [showModal, setShowModal] = useState(false);

    const closeMenu = () => onAction?.();

    return (
        <>
            <Dropdown.Item
                onClick={() => {
                    setShowModal(true);
                }}
                title={intl.formatMessage({ id: 'msg.removeTrack.hint' }, { name: track.name ?? '' })}
            >
                <TrashIcon />
                <span>
                    <FormattedMessage id={'msg.removeTrack'} />
                </span>
            </Dropdown.Item>
            {showModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        dispatch(trackMergeActions.removeTrackComposition(id));
                        setShowModal(false);
                        closeMenu();
                    }}
                    closeModal={() => {
                        setShowModal(false);
                        closeMenu();
                    }}
                    title={`Removing track ${track.name ?? ''}`}
                    body={`Do you really want to remove the track ${track.name ?? ''}?`}
                />
            )}
        </>
    );
}
