import { createSelector } from '@reduxjs/toolkit';
import { getGapToleranceInKm, getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import geoDistance from 'geo-distance-helper';
import { GapPoint, isTrackSegment, ParsedPoint, PointOfInterestType } from '../../store/types.ts';
import { getLatLng } from '../../../utils/pointUtil.ts';
import { v4 as uuidv4 } from 'uuid';

export const getGaps = createSelector(
    getTrackCompositions,
    getParsedGpxSegments,
    getGapToleranceInKm,
    (tracks, segments, tolerance) => {
        const gaps: GapPoint[] = [];
        tracks.forEach((track) => {
            let lastPoint: ParsedPoint | null = null;
            let lastSegmentId: string | null = null;
            track.segments.filter(isTrackSegment).forEach((segment) => {
                const foundSegment = segments.find((s) => s.id === segment.segmentId);
                if (!foundSegment || foundSegment.points.length === 0) {
                    return;
                }
                if (lastPoint && lastSegmentId) {
                    const firstPointOfSegment = foundSegment.points[0];
                    const distance = Number(geoDistance(getLatLng(lastPoint), getLatLng(firstPointOfSegment)));

                    if (distance > tolerance) {
                        const lat = (lastPoint.b + firstPointOfSegment.b) / 2;
                        const lng = (lastPoint.l + firstPointOfSegment.l) / 2;
                        gaps.push({
                            id: uuidv4(),
                            lat,
                            lng,
                            type: PointOfInterestType.GAP,
                            radiusInM: (distance * 1000) / 2,
                            title: '',
                            description: 'Distance ' + distance * 1000,
                            trackId: track.id,
                            segmentIdBefore: lastSegmentId,
                            segmentIdAfter: segment.segmentId,
                        });
                    }
                }
                lastPoint = foundSegment.points[foundSegment.points.length - 1];
                lastSegmentId = segment.segmentId;
            });
        });
        return gaps;
    }
);
