import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../../planner/store/types';
import { getData } from '../../api/api';
import { getPlanningTitle } from '../../planner/store/settings.reducer';
import { planningActions } from '../store/displayTracksReducer';

export async function loadServerFile(id: string, dispatch: Dispatch) {
    return getData(id)
        .then((planning: State) => {
            const planningTitle = getPlanningTitle(planning);
            if (planningTitle) {
                document.title = planningTitle;
            }
            dispatch(planningActions.setPlanning(planning));
        })
        .catch(console.error)
        .finally();
}
