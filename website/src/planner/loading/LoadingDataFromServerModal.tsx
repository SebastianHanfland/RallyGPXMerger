import { useGetUrlParam } from '../../utils/linkUtil.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { getData } from '../../api/api.ts';
import { backendActions, getPlanningId, getPlanningPassword } from '../store/backend.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { getParsedGpxSegments } from '../store/segmentData.redux.ts';
import { storage } from '../store/storage.ts';
import { loadPlanning } from './loadPlanningFromServer.ts';
import { isStateTheSame } from './IsStateTheSame.ts';
import { errorNotification } from '../store/toast.reducer.ts';

export function LoadingDataFromServerModal() {
    const planningId = useGetUrlParam('planning=');
    const adminToken = useGetUrlParam('admin=');
    const planningPassword = useSelector(getPlanningPassword);
    const localPlanningId = useSelector(getPlanningId);
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();
    const [loadFromServer, setLoadFromServer] = useState(false);
    const [decided, setDecided] = useState(false);
    const [isDataSame, setIsDataSame] = useState<boolean | undefined>(undefined);

    const trackCompositions = useSelector(getTrackCompositions);
    const segments = useSelector(getParsedGpxSegments);
    const noLocalDataStored = segments.length === 0 && trackCompositions.length === 0;
    const differentPlanningId = !!planningId && !!localPlanningId && planningId !== localPlanningId;
    const shouldBeLoaded = noLocalDataStored || (decided && loadFromServer);

    useEffect(() => {
        if (planningId) {
            getData(planningId)
                .then((serverState) => {
                    const storedState = storage.load();
                    if (!storedState) {
                        console.log('No stored state');
                        setLoadFromServer(true);
                        setDecided(true);
                        return;
                    }
                    if (isStateTheSame(serverState, storedState)) {
                        console.log('state is same');
                        setDecided(true);
                        setIsDataSame(true);
                        return;
                    }
                    console.log('states are different');
                    setIsDataSame(false);
                })
                .catch((error) => {
                    console.error(error);
                    // When there is no local plan, loadPlanning handles this error and
                    // shows the notification. Avoid reporting the same failed request twice.
                    if (shouldBeLoaded) {
                        return;
                    }
                    setDecided(true);
                    errorNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataLoad.error.title' }),
                        intl.formatMessage({ id: 'msg.dataLoad.error.message' })
                    );
                });
        }
    }, []);

    useEffect(() => {
        if (!decided && shouldBeLoaded) {
            setDecided(true);
        }
    }, [shouldBeLoaded]);

    useEffect(() => {
        if (loadFromServer || shouldBeLoaded) {
            if (planningId) {
                loadPlanning(planningId, dispatch, adminToken, planningPassword, intl);
            }
        }
    }, [planningId, loadFromServer, shouldBeLoaded]);

    if (decided || isDataSame || isDataSame === undefined) {
        return null;
    }

    if ((planningId && !noLocalDataStored) || differentPlanningId || !isDataSame) {
        const titleMessage = differentPlanningId ? 'msg.differentPlannnings' : 'msg.localDataFound';
        const detailsMessage = differentPlanningId ? 'msg.differentPlannnings.details' : 'msg.localDataFound.details';
        return (
            <ConfirmationModal
                onConfirm={() => {
                    setLoadFromServer(true);
                    setDecided(true);
                }}
                closeModal={() => {
                    setDecided(true);
                    if (differentPlanningId) {
                        dispatch(backendActions.setPlanningId(localPlanningId));
                    }
                }}
                title={intl.formatMessage({ id: titleMessage })}
                body={intl.formatMessage({ id: detailsMessage })}
            />
        );
    }
}
