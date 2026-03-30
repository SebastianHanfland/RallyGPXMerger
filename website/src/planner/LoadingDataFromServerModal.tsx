import { useGetUrlParam } from '../utils/linkUtil.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { getData } from '../api/api.ts';
import { backendActions, getPlanningId, getPlanningPassword } from './store/backend.reducer.ts';
import { AppDispatch } from './store/planningStore.ts';
import { State } from './store/types.ts';
import { getTrackCompositions } from './store/trackMerge.reducer.ts';
import { ConfirmationModal } from '../common/ConfirmationModal.tsx';
import { getParsedGpxSegments } from './store/segmentData.redux.ts';
import { storage } from './store/storage.ts';
import { loadPlanning } from './useLoadPlanningFromServer.tsx';

function isSame(serverState: State, storedState: State) {
    const stateAreas = [
        (state: State) => state.segmentData,
        (state: State) => state.trackMerge,
        (state: State) => state.nodes,
        (state: State) => state.settings,
    ];

    for (const stateAccess of stateAreas) {
        if (JSON.stringify(stateAccess(serverState)) !== JSON.stringify(stateAccess(storedState))) {
            return false;
        }
    }
    return true;
}

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
        console.log({ planningId });
        if (planningId) {
            getData(planningId).then((serverState) => {
                const storedState = storage.load();
                if (!storedState) {
                    console.log('No stored state');
                    setLoadFromServer(true);
                    setDecided(true);

                    return;
                }
                if (isSame(serverState, storedState)) {
                    console.log('state is same');
                    setDecided(true);
                    setIsDataSame(true);
                    return;
                }
                console.log('states are different');
                setIsDataSame(false);
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
