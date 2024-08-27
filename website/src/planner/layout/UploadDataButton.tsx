import { Button, Form } from 'react-bootstrap';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { CSSProperties, useState } from 'react';
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

const removeDataStyle: CSSProperties = {
    position: 'fixed',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    left: 10,
    bottom: 170,
    zIndex: 10,
    overflow: 'hidden',
    cursor: 'pointer',
};

export function UploadDataButton() {
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const isPlanningAlreadySaved = useSelector(getIsPlanningAlreadySaved);
    const planningId = useSelector(getPlanningId);
    const planningPassword = useSelector(getPlanningPassword);
    const planningState = useSelector((state: State) => state);
    const intl = useIntl();

    const uploadAllData = () => {
        if (!planningPassword) {
            return;
        }
        if (!isPlanningAlreadySaved || !planningId) {
            // TODO remove backend session or at least password here from state
            createPlanning(planningState, planningPassword).then((newPlanningId) =>
                dispatch(backendActions.setPlanningId(newPlanningId))
            );
        } else {
            updatePlanning(planningId, planningState, planningPassword);
        }
        setShowModal(false);
        dispatch(backendActions.setIsPlanningSaved(true));
    };
    return (
        <>
            <Button
                style={removeDataStyle}
                className={'m-0 p-0'}
                variant="success"
                title={intl.formatMessage({ id: 'msg.uploadCurrentPlanning.hint' })}
                onClick={() => {
                    if (!isPlanningAlreadySaved || !planningId || !planningPassword) {
                        setShowModal(true);
                    } else {
                        updatePlanning(planningId, planningState, planningPassword);
                    }
                }}
            >
                <img src={fileUp} className="m-1" alt="fileUp" style={{ height: '30px', width: '30px' }} />
            </Button>
            {showModal && (
                <ConfirmationModal
                    onConfirm={uploadAllData}
                    confirmDisabled={!planningPassword}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.uploadCurrentPlanning.modalTitle' })}
                    body={<UploadModalBody />}
                />
            )}
        </>
    );
}

const UploadModalBody = () => {
    const planningPassword = useSelector(getPlanningPassword);
    const dispatch = useDispatch();
    const intl = useIntl();
    return (
        <div>
            <div>{intl.formatMessage({ id: 'msg.uploadCurrentPlanning.modalBody' })}</div>
            <div>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.password' })}
                    value={planningPassword ?? ''}
                    onChange={(value) => dispatch(backendActions.setPlanningPassword(value.target.value))}
                />
            </div>
        </div>
    );
};
