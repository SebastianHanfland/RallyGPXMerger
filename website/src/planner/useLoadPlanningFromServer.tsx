import { useGetUrlParam } from '../utils/linkUtil.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useEffect } from 'react';
import { getData } from '../api/api.ts';
import { backendActions, getPlanningPassword } from './store/backend.reducer.ts';
import { errorNotification, successNotification, toastsActions } from './store/toast.reducer.ts';

export function useLoadPlanningFromServer() {
    const planningId = useGetUrlParam('planning=');
    const adminToken = useGetUrlParam('admin=');
    const planningPassword = useSelector(getPlanningPassword);
    const dispatch = useDispatch();
    const intl = useIntl();

    useEffect(() => {
        if (planningId) {
            getData(planningId)
                .then((data) => {
                    dispatch({ payload: data.data, type: 'wholeState' });
                    dispatch(backendActions.setPlanningId(planningId));
                    dispatch(toastsActions.clearToasts());
                    const passwordToSet = adminToken ?? planningPassword;
                    if (passwordToSet) {
                        dispatch(backendActions.setPlanningPassword(passwordToSet));
                    }
                    dispatch(backendActions.setIsPlanningSaved(true));
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
