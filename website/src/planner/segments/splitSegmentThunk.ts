import { v4 as uuidv4 } from 'uuid';

import { State } from '../store/types.ts';
import { getClickOnSegment, getGpxSegments, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { splitGpx } from '../../utils/gpxSplitUtil.ts';
import { executeGpxSegmentReplacement } from './fileReplaceThunk.ts';
import { AppDispatch } from '../store/store.ts';
import { GpxSegment } from '../../common/types.ts';

export const splitGpxAtPosition = (dispatch: AppDispatch, getState: () => State) => {
    const gpxSegments = getGpxSegments(getState());
    const clickOnSegment = getClickOnSegment(getState());
    const clickedSegment = gpxSegments.find((segment) => segment.id === clickOnSegment?.segmentId);

    if (!clickedSegment || !clickOnSegment) {
        return null;
    }

    const [gpxSegmentBefore, gpxSegmentAfter] = splitGpx(clickedSegment.content, clickOnSegment);
    const replacementSegments: GpxSegment[] = [
        { ...clickedSegment, content: gpxSegmentBefore, id: uuidv4(), filename: `${clickedSegment.filename}-1` },
        { ...clickedSegment, content: gpxSegmentAfter, id: uuidv4(), filename: `${clickedSegment.filename}-2` },
    ];
    dispatch(gpxSegmentsActions.setReplaceProcess({ targetSegment: clickedSegment.id, replacementSegments }));
    dispatch(executeGpxSegmentReplacement);
};
