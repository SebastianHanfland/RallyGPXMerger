import { useGetUrlParam } from '../utils/linkUtil.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useEffect } from 'react';
import { getData } from '../api/api.ts';
import { backendActions, getPlanningPassword } from './store/backend.reducer.ts';
import { errorNotification, successNotification, toastsActions } from './store/toast.reducer.ts';
import { AppDispatch } from './store/planningStore.ts';
import { State } from './store/types.ts';
import { trackMergeActions } from './store/trackMerge.reducer.ts';

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
    dispatch(trackMergeActions.setIsCalculationRunning(false));
    const passwordToSet = adminToken ?? planningPassword;
    if (passwordToSet) {
        dispatch(backendActions.setPlanningPassword(passwordToSet));
    }
    dispatch(backendActions.setIsPlanningSaved(!!planningId));
}

export function useLoadPlanningFromServer() {
    const planningId = useGetUrlParam('planning=');
    const adminToken = useGetUrlParam('admin=');
    const planningPassword = useSelector(getPlanningPassword);
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();

    useEffect(() => {
        if (planningId) {
            getData(planningId)
                .then((state) => {
                    loadStateAndSetUpPlanner(dispatch, state, planningId, adminToken, planningPassword);
                    successNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataLoad.success.title' }),
                        intl.formatMessage({ id: 'msg.dataLoad.success.message' })
                    );
                })
                .catch(() => {
                    errorNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataLoad.error.title' }),
                        intl.formatMessage({ id: 'msg.dataLoad.error.message' })
                    );
                });
        }
    }, [planningId]);
}
