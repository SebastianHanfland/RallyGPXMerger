import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import trash from '../../assets/trashB.svg';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
    id: string;
    name: string;
}

export function RemoveFileButton({ id, name }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const removeGpxSegment = () => {
        dispatch(gpxSegmentsActions.removeGpxSegment(id));
        dispatch(trackMergeActions.removeGpxSegment(id));
    };
    return (
        <>
            <Dropdown.Item title={`Remove file "${name}" and all references`} onClick={() => setShowModal(true)}>
                <img src={trash} className="m-1" alt="trash" />
                <span>
                    <FormattedMessage id={'msg.removeFile'} />
                </span>
            </Dropdown.Item>
            {showModal && (
                <ConfirmationModal
                    onConfirm={removeGpxSegment}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.removeSegment.modalTitle' })}
                    body={intl.formatMessage({ id: 'msg.removeSegment.modalBody' }, { name })}
                />
            )}
        </>
    );
}
