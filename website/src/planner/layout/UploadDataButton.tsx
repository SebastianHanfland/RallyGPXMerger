import { Button, Spinner } from 'react-bootstrap';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import fileUp from '../../assets/file-up.svg';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
    backendActions,
    getIsPlanningAlreadySaved,
    getPlanningId,
    getPlanningPassword,
} from '../store/backend.reducer.ts';
import { createPlanning, updatePlanning } from '../../api/api.ts';
import { State } from '../store/types.ts';
import { UploadModalBody } from './UploadModalBody.tsx';
import { errorNotification, successNotification } from '../store/toast.reducer.ts';
import { downloadFile } from '../segments/FileDownloader.tsx';
import { getBaseUrl } from '../../utils/linkUtil.ts';
import { getPlanningTitle } from '../store/trackMerge.reducer.ts';
import { layoutActions } from '../store/layout.reducer.ts';
import Modal from 'react-bootstrap/Modal';

export function UploadDataButton() {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const isPlanningAlreadySaved = useSelector(getIsPlanningAlreadySaved);
    const planningId = useSelector(getPlanningId);
    const planningPassword = useSelector(getPlanningPassword);
    const planningTitle = useSelector(getPlanningTitle);

    const planningState = useSelector((state: State) => state);
    const intl = useIntl();

    const uploadAllData = () => {
        if (!planningPassword) {
            return;
        }
        if (!isPlanningAlreadySaved || !planningId) {
            setShowModal(false);
            setIsLoading(true);
            createPlanning(planningState, planningPassword)
                .then((newPlanningId) => {
                    dispatch(backendActions.setPlanningId(newPlanningId));
                    successNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataAdded.success.title' }),
                        intl.formatMessage({ id: 'msg.dataAdded.success.message' })
                    );
                    const displayLink = `${getBaseUrl()}?display=${newPlanningId}`;
                    const planningLink = `${getBaseUrl()}?planning=${newPlanningId}`;
                    const planningLinkWithAdmin = `${getBaseUrl()}?planning=${newPlanningId}&admin=${planningPassword}`;
                    downloadFile(
                        `${newPlanningId}-Info.txt`,
                        `${intl.formatMessage({ id: 'msg.publicLink' })}: ${displayLink}\n` +
                            `${intl.formatMessage({ id: 'msg.planningLink' })}: ${planningLink}\n` +
                            `${intl.formatMessage({ id: 'msg.planningLinkWithAdmin' })}: ${planningLinkWithAdmin}\n` +
                            `${intl.formatMessage({ id: 'msg.planningPassword' })}: ${planningPassword}`
                    );
                    successNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.fileSaved.success.title' }),
                        intl.formatMessage({ id: 'msg.fileSaved.success.message' })
                    );
                })
                .catch(() =>
                    errorNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataAdded.error.title' }),
                        intl.formatMessage({ id: 'msg.dataAdded.error.message' })
                    )
                )
                .finally(() => setIsLoading(false));
        } else {
            setShowModal(false);
            setIsLoading(true);
            updatePlanning(planningId, planningState, planningPassword)
                .then(() => {
                    successNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataUpdated.success.title' }),
                        intl.formatMessage({ id: 'msg.dataUpdated.success.message' })
                    );
                })
                .catch(() =>
                    errorNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataUpdated.error.title' }),
                        intl.formatMessage({ id: 'msg.dataUpdated.error.message' })
                    )
                )
                .finally(() => setIsLoading(false));
        }
        setShowModal(false);
        dispatch(backendActions.setIsPlanningSaved(true));
    };
    return (
        <>
            <Modal
                show={isLoading}
                style={{ backgroundColor: 'transparent' }}
                contentClassName={'bg-transparent border-0'}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Spinner style={{ width: '30vh', height: '30vh' }} />
                </div>
            </Modal>
            <Button
                className={'m-0 p-0'}
                variant="success"
                disabled={isLoading}
                title={intl.formatMessage({ id: 'msg.uploadCurrentPlanning.hint' })}
                onClick={() => {
                    if (!planningTitle) {
                        dispatch(layoutActions.setIsSidebarOpen(true));
                        dispatch(layoutActions.setSelectedSidebarSection('settings'));
                        errorNotification(
                            dispatch,
                            intl.formatMessage({ id: 'msg.noTitle.error.title' }),
                            intl.formatMessage({ id: 'msg.noTitle.error.message' })
                        );
                        return;
                    }
                    if (!isPlanningAlreadySaved || !planningId || !planningPassword) {
                        setShowModal(true);
                    } else {
                        setIsLoading(true);
                        updatePlanning(planningId, planningState, planningPassword)
                            .then(() =>
                                successNotification(
                                    dispatch,
                                    intl.formatMessage({ id: 'msg.dataUpdated.success.title' }),
                                    intl.formatMessage({ id: 'msg.dataUpdated.success.message' })
                                )
                            )
                            .catch(() =>
                                errorNotification(
                                    dispatch,
                                    intl.formatMessage({ id: 'msg.dataUpdated.error.title' }),
                                    intl.formatMessage({ id: 'msg.dataUpdated.error.message' })
                                )
                            )
                            .finally(() => setIsLoading(false));
                    }
                }}
            >
                <img src={fileUp} className="m-1" alt="fileUp" style={{ height: '30px', width: '30px' }} />
                {intl.formatMessage({ id: 'msg.uploadCurrentPlanning' })}
            </Button>
            {showModal && (
                <ConfirmationModal
                    onConfirm={uploadAllData}
                    confirmDisabled={!planningPassword}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.uploadCurrentPlanning.modalTitle' })}
                    body={<UploadModalBody text={intl.formatMessage({ id: 'msg.uploadCurrentPlanning.modalBody' })} />}
                />
            )}
        </>
    );
}
