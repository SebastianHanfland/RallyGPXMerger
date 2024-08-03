import { layoutActions } from '../store/layout.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../store/store.ts';

export const simpleRallyThunk = (dispatch: AppDispatch) => {
    dispatch(trackMergeActions.addTrackComposition({ id: uuidv4(), segmentIds: [], name: '' }));
    setTimeout(() => {
        dispatch(layoutActions.setIsSidebarOpen(true));
        dispatch(trackMergeActions.setDefaultArrivalDateTime());
        dispatch(trackMergeActions.setIsCalculationOnTheFly(true));
        dispatch(layoutActions.setShowDashboard(true));
        dispatch(layoutActions.selectSection('gps'));
    }, 10);
};
