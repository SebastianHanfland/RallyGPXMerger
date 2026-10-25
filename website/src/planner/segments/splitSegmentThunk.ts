import { v4 as uuidv4 } from 'uuid';

import { ParsedGpxSegment, State } from '../store/types';
import { splitGpx } from '../../utils/gpxSplitUtil';
import { executeGpxSegmentReplacementWithUpload } from './fileReplaceWithUploadThunk';
import { AppDispatch } from '../store/planningStore';
import { getClickOnSegment, getParsedGpxSegments, segmentDataActions } from '../store/segmentData.redux';

export const splitGpxAtPosition = (dispatch: AppDispatch, getState: () => State) => {
    const gpxSegments = getParsedGpxSegments(getState());
    const clickOnSegment = getClickOnSegment(getState());
    const clickedSegment = gpxSegments.find((segment) => segment.id === clickOnSegment?.segmentId);

    if (!clickedSegment || !clickOnSegment) {
        return null;
    }

    const [pointsBefore, pointsAfter] = splitGpx(clickedSegment.points, clickOnSegment);
    const replacementSegments: ParsedGpxSegment[] = [
        { ...clickedSegment, points: pointsBefore, id: uuidv4(), filename: `${clickedSegment.filename}-1` },
        { ...clickedSegment, points: pointsAfter, id: uuidv4(), filename: `${clickedSegment.filename}-2` },
    ];
    dispatch(segmentDataActions.setReplaceProcess({ targetSegment: clickedSegment.id, replacementSegments }));
    dispatch(segmentDataActions.addGpxSegments(replacementSegments));
    dispatch(executeGpxSegmentReplacementWithUpload);
};
