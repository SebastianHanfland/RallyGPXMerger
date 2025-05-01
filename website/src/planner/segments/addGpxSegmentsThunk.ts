import { Dispatch } from '@reduxjs/toolkit';
import { GpxSegment, ParsedTrack } from '../../common/types.ts';
import { parsedTracksActions } from '../store/parsedTracks.reducer.ts';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { optionallyDecompress } from '../store/compressHelper.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';

export const addGpxSegments =
    (gpxSegments: GpxSegment[], versionId: string = 'current') =>
    (dispatch: Dispatch) => {
        const parsedSegments = gpxSegments.map((segment): ParsedTrack => {
            const points = SimpleGPX.fromString(optionallyDecompress(segment.content)).getPoints();
            return {
                id: segment.id,
                filename: segment.filename,
                version: versionId,
                color: getColorFromUuid(segment.id),
                points: segment.flipped ? points.reverse() : points,
            };
        });
        dispatch(parsedTracksActions.setParsedSegments(parsedSegments));
        dispatch(gpxSegmentsActions.addGpxSegments(gpxSegments));
    };
