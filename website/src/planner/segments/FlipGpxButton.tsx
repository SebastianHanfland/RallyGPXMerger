import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import flip from '../../assets/flip.svg';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
    id: string;
    name: string;
}

export function FlipGpxButton({ id, name }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const removeGpxSegment = () => {
        dispatch(gpxSegmentsActions.removeGpxSegment(id));
        dispatch(trackMergeActions.removeGpxSegment(id));
    };
    return (
        <>
            <Dropdown.Item
                title={intl.formatMessage({ id: 'msg.removeFile.hint' }, { name })}
                onClick={() => setShowModal(true)}
            >
                <img src={flip} className="m-1" alt="trash" />
                <span>
                    <FormattedMessage id={'msg.flipGpx'} />
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
