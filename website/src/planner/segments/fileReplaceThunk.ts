import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../store/types.ts';
import { getReplaceProcess, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';

export const executeGpxSegmentReplacement = (dispatch: Dispatch, getState: () => State) => {
    const replaceProcess = getReplaceProcess(getState());

    if (!replaceProcess || replaceProcess.replacementSegments.length === 0) {
        return;
    }

    const { replacementSegments, targetSegment } = replaceProcess;
    if (replacementSegments.length === 1) {
        const payload = { id: targetSegment, newContent: replacementSegments[0].content };
        dispatch(gpxSegmentsActions.changeGpxSegmentContent(payload));
        gpxSegmentsActions.setFilename({ id: targetSegment, filename: replacementSegments[0].filename });
    } else {
    }

    dispatch(gpxSegmentsActions.setReplaceProcess(undefined));
};
