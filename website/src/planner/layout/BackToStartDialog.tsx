import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { resetData } from '../io/resetData.ts';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';

export function BackToStartDialog(props: { closeModal: () => void }) {
    const dispatch = useDispatch();
    const intl = useIntl();

    const removeAllData = () => {
        resetData(dispatch);
        props.closeModal();
    };

    return (
        <ConfirmationModal
            onConfirm={removeAllData}
            closeModal={props.closeModal}
            title={intl.formatMessage({ id: 'msg.removeAllData.modalTitle' })}
            body={intl.formatMessage({ id: 'msg.removeAllData.modalBody' })}
        />
    );
}
