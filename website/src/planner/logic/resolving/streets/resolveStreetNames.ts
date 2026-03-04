import { AppDispatch } from '../../../store/planningStore.ts';
import { State } from '../../../store/types.ts';
import { getParsedGpxSegments } from '../../../store/segmentData.redux.ts';
import { enrichGpxSegmentsWithStreetNames } from './mapMatchingStreetResolver.ts';
import { enrichGpxSegmentsWithPostCodesAndDistricts } from './enrichWithPostCodeAndDistrict.ts';
import { errorNotification } from '../../../store/toast.reducer.ts';

export const resolveStreetNames =
    (segmentId: string) =>
    (dispatch: AppDispatch, getState: () => State): Promise<void> => {
        const foundSegment = getParsedGpxSegments(getState()).find((segment) => segment.id === segmentId);

        if (!foundSegment) {
            errorNotification(dispatch, 'Segment not found');
            return Promise.resolve();
        }
        return dispatch(enrichGpxSegmentsWithStreetNames([foundSegment])).then(() =>
            dispatch(enrichGpxSegmentsWithPostCodesAndDistricts)
        );
    };
