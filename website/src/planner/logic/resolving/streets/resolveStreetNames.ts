import { AppDispatch } from '../../../store/planningStore';
import { State } from '../../../store/types';
import { getParsedGpxSegments } from '../../../store/segmentData.redux';
import { enrichGpxSegmentsWithStreetNames } from './mapMatchingStreetResolver';
import { enrichGpxSegmentsWithPostCodesAndDistricts } from './enrichWithPostCodeAndDistrict';
import { errorNotification } from '../../../store/toast.reducer';

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
