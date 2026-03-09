import { TrackComposition } from '../../../planner/store/types.ts';
import { getBranchTracks } from '../../../planner/nodes/getBranchesAtNode.ts';

function getHighestPriorityOfTrack(tracks: TrackComposition[]): number {
    let highestPriority = 0;
    tracks.forEach((track) => {
        if ((track.priority ?? 0) > highestPriority) {
            highestPriority = track.priority ?? 0;
        }
    });
    return highestPriority;
}

export function getBranchPriorities(
    segmentIdAfterNode: string,
    trackCompositions: TrackComposition[]
): Record<string, number> {
    const branchTracks = getBranchTracks(segmentIdAfterNode, trackCompositions);

    const priorityCounter: Record<string, number> = {};
    if (branchTracks) {
        Object.entries(branchTracks).map(([segmentId, tracks]) => {
            priorityCounter[segmentId] = getHighestPriorityOfTrack(tracks);
        });
    }

    return priorityCounter;
}
