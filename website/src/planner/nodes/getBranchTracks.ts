import { TrackComposition } from '../store/types.ts';
import { listAllNodesOfTracks } from '../../common/calculation/nodes/nodeFinder.ts';

export const getBranchTracks = (segmentAfterId: string, tracks: TrackComposition[]) => {
    const trackNodes = listAllNodesOfTracks(tracks);
    const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === segmentAfterId);
    if (!foundTrackNode) {
        return undefined;
    }
    const branchSegmentIds = [...new Set(foundTrackNode.segmentsBeforeNode.map((segment) => segment.segmentId))];

    const branchTracks: Record<string, TrackComposition[]> = {};
    branchSegmentIds.forEach((branchId) => {
        branchTracks[branchId] = tracks.filter((track) =>
            track.segments.map((segment) => segment.id).includes(branchId)
        );
    });
    // Set participants if a track starts at the node
    foundTrackNode.segmentsBeforeNode
        .filter((segmentsBefore) => segmentsBefore.trackIdInsteadOfSegmentId)
        .map((segment) => segment.trackId)
        .forEach((trackId) => {
            branchTracks[trackId] = tracks.filter((track) => track.id === trackId);
        });
    return branchTracks;
};
