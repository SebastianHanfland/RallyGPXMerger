import { useSelector } from 'react-redux';
import { getArrivalDateTime, getTrackCompositions } from '../store/trackMerge.reducer.ts';

export function incompleteTrackDataHook() {
    const arrivalDate = useSelector(getArrivalDateTime);
    const trackCompositions = useSelector(getTrackCompositions);
    const hasTrackCompositions = trackCompositions.length === 0;
    const someTrackHasNoSegments = trackCompositions.some((track) => track.segmentIds.length === 0);
    return !arrivalDate || hasTrackCompositions || someTrackHasNoSegments;
}
