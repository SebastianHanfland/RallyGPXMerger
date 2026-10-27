import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { trackMergeActions } from '../../store/trackMerge.reducer';
import { ConfirmationModal } from '../../../common/ConfirmationModal';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { segmentDataActions } from '../../store/segmentData.redux';
import { TrashIcon } from '../../../utils/icons/TrashIcon';

interface Props {
    id: string;
    name: string;
    onAction?: () => void;
}

export function RemoveFileButton({ id, name, onAction }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const removeGpxSegment = () => {
        dispatch(segmentDataActions.removeGpxSegment(id));
        dispatch(trackMergeActions.removeGpxSegment(id));
        onAction?.();
    };
    return (
        <>
            <Dropdown.Item
                title={intl.formatMessage({ id: 'msg.removeFile.hint' }, { name })}
                onClick={() => setShowModal(true)}
            >
                <TrashIcon />
                <span>
                    <FormattedMessage id={'msg.removeFile'} />
                </span>
            </Dropdown.Item>
            {showModal && (
                <ConfirmationModal
                    onConfirm={removeGpxSegment}
                    closeModal={() => {
                        setShowModal(false);
                        onAction?.();
                    }}
                    title={intl.formatMessage({ id: 'msg.removeSegment.modalTitle' })}
                    body={intl.formatMessage({ id: 'msg.removeSegment.modalBody' }, { name })}
                />
            )}
        </>
    );
}
