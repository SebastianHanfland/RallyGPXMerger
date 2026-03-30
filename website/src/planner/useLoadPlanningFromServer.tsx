import { IntlShape } from 'react-intl';
import { getData } from '../api/api.ts';
import { backendActions } from './store/backend.reducer.ts';
import { errorNotification, successNotification, toastsActions } from './store/toast.reducer.ts';
import { AppDispatch } from './store/planningStore.ts';
import { State } from './store/types.ts';

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

export function loadPlanning(
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
