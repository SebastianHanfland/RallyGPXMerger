import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import deleteCloud from '../../assets/deleteCloud.svg';
import { useIntl } from 'react-intl';
import {
    backendActions,
    getIsPlanningAlreadySaved,
    getPlanningId,
    getPlanningPassword,
} from '../store/backend.reducer.ts';
import { deletePlanning } from '../../api/api.ts';
import { errorNotification, successNotification } from '../store/toast.reducer.ts';

export function RemoveUploadedDataButton() {
    const dispatch = useDispatch();
    const isPlanningAlreadySaved = useSelector(getIsPlanningAlreadySaved);
    const planningId = useSelector(getPlanningId);
    const password = useSelector(getPlanningPassword);
    const [showModal, setShowModal] = useState(false);
    const intl = useIntl();

    if (!isPlanningAlreadySaved || !planningId || !password) {
        return null;
    }

    const removeAllData = () => {
        if (password) {
            deletePlanning(planningId, password)
                .then(() => {
                    dispatch(backendActions.setIsPlanningSaved(false));
                    setShowModal(false);
                })
                .then(() =>
                    successNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataRemoved.success.title' }),
                        intl.formatMessage({ id: 'msg.dataRemoved.success.message' })
                    )
                )
                .catch(() =>
                    errorNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataRemoved.error.title' }),
                        intl.formatMessage({ id: 'msg.dataRemoved.error.message' })
                    )
                );
        }
    };
    return (
        <>
            <Button
                variant="danger"
                title={intl.formatMessage({ id: 'msg.removeAllData.hint' })}
                onClick={() => setShowModal(true)}
            >
                <img src={deleteCloud} className="m-1" alt="trash" style={{ height: '20px', width: '20px' }} />
                {intl.formatMessage({ id: 'msg.removeAllData' })}
            </Button>
            {showModal && (
                <ConfirmationModal
                    onConfirm={removeAllData}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.removeAllServerData.modalTitle' })}
                    body={intl.formatMessage({ id: 'msg.removeAllServerData.modalBody' })}
                />
            )}
        </>
    );
}
