import { useGetUrlParam } from '../utils/linkUtil.ts';
import { useDispatch, useSelector } from 'react-redux';
import { IntlShape, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { getData } from '../api/api.ts';
import { backendActions, getPlanningPassword } from './store/backend.reducer.ts';
import { errorNotification, successNotification, toastsActions } from './store/toast.reducer.ts';
import { AppDispatch } from './store/planningStore.ts';
import { State } from './store/types.ts';
import { getTrackCompositions } from './store/trackMerge.reducer.ts';
import { ConfirmationModal } from '../common/ConfirmationModal.tsx';
import { getParsedGpxSegments } from './store/segmentData.redux.ts';

export function loadStateAndSetUpPlanner(
    dispatch: AppDispatch,
    state: State,
    planningId?: string,
    adminToken?: string,
    planningPassword?: string
) {
    dispatch({ payload: state, type: 'wholeState' });

    if (planningId) {
        dispatch(backendActions.setPlanningId(planningId));
    }
    dispatch(toastsActions.clearToasts());
    const passwordToSet = adminToken ?? planningPassword;
    if (passwordToSet) {
        dispatch(backendActions.setPlanningPassword(passwordToSet));
    }
    dispatch(backendActions.setIsPlanningSaved(!!planningId));
}

function loadPlanning(
    planningId: string,
    dispatch: AppDispatch,
    adminToken: string | undefined,
    planningPassword: string | undefined,
    intl: IntlShape
) {
    getData(planningId)
        .then((state) => {
            loadStateAndSetUpPlanner(dispatch, state, planningId, adminToken, planningPassword);
            successNotification(
                dispatch,
                intl.formatMessage({ id: 'msg.dataLoad.success.title' }),
                intl.formatMessage({ id: 'msg.dataLoad.success.message' })
            );
        })
        .catch((e) => {
            console.error(e);
            errorNotification(
                dispatch,
                intl.formatMessage({ id: 'msg.dataLoad.error.title' }),
                intl.formatMessage({ id: 'msg.dataLoad.error.message' })
            );
        });
}

export function UseLoadPlanningFromServer() {
    const planningId = useGetUrlParam('planning=');
    const adminToken = useGetUrlParam('admin=');
    const planningPassword = useSelector(getPlanningPassword);
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();
    const [loadFromServer, setLoadFromServer] = useState(false);
    const [decided, setDecided] = useState(false);

    const trackCompositions = useSelector(getTrackCompositions);
    const segments = useSelector(getParsedGpxSegments);
    const noLocalDataStored = segments.length === 0 && trackCompositions.length === 0;

    useEffect(() => {
        if (!decided && noLocalDataStored) {
            setDecided(true);
        }
    }, [noLocalDataStored]);

    useEffect(() => {
        console.log({ trackCompositions }, 2);
        if (loadFromServer || noLocalDataStored) {
            if (planningId) {
                loadPlanning(planningId, dispatch, adminToken, planningPassword, intl);
            }
        }
    }, [planningId, loadFromServer]);

    useEffect(() => {
        console.log({ planningId, trackCompositions }, 2);
    }, []);

    if (decided) {
        return null;
    }

    if (planningId && !noLocalDataStored) {
        return (
            <ConfirmationModal
                onConfirm={() => {
                    setLoadFromServer(true);
                    setDecided(true);
                }}
                closeModal={() => setDecided(true)}
                title={intl.formatMessage({ id: 'msg.localDataFound' })}
                body={intl.formatMessage({ id: 'msg.localDataFound.details' })}
            />
        );
    }
}
