import { NodeSpecifications, TrackComposition } from '../../../planner/store/types.ts';
import { listAllNodesOfTracks, TrackNode, TrackNodeSegment } from '../nodes/nodeFinder.ts';

const sortByPeopleOnTrack =
    (segmentsBeforeNode: TrackNodeSegment[], peopleOnBranch: Record<string, number>) =>
    (tA: TrackComposition, tB: TrackComposition) => {
        if ((tA.priority ?? 0) > (tB.priority ?? 0)) {
            return -1;
        }
        if ((tA.priority ?? 0) < (tB.priority ?? 0)) {
            return 1;
        }
        const segmentA = segmentsBeforeNode.find((seg) => seg.trackId === tA.id)?.segmentId;
        const segmentB = segmentsBeforeNode.find((seg) => seg.trackId === tB.id)?.segmentId;
        if (!segmentA) {
            return 1;
        }
        if (!segmentB) {
            return -1;
        }
        return peopleOnBranch[segmentA] > peopleOnBranch[segmentB] ? -1 : 1;
    };

const isRelevantForTrack = (trackNodeSegments: TrackNodeSegment[], trackId: string) => (track: TrackComposition) => {
    if (track.id === trackId) {
        return true;
    }
    const segmentIdOfOtherTrack = trackNodeSegments.find((seg) => seg.trackId === track.id)?.segmentId;
    const segmentIdOfTrack = trackNodeSegments.find((seg) => seg.trackId === trackId)?.segmentId;
    return segmentIdOfOtherTrack !== segmentIdOfTrack;
};

function countPeopleOnSegments(segmentsBeforeNode: TrackNodeSegment[]) {
    const peopleOnBranch: Record<string, number> = {};
    segmentsBeforeNode.forEach((segment) => {
        if (peopleOnBranch[segment.segmentId] !== undefined) {
            peopleOnBranch[segment.segmentId] += segment.amount ?? 0;
        } else {
            peopleOnBranch[segment.segmentId] = segment.amount ?? 0;
        }
    });
    return peopleOnBranch;
}

export function sumUpAllPeopleWithHigherPriority(
    trackCompositions: TrackComposition[],
    trackNode: TrackNode,
    trackId: string
): number {
    const { segmentsBeforeNode } = trackNode;

    if (!segmentsBeforeNode.find((seg) => seg.trackId === trackId)) {
        return 0;
    }
    const peopleOnSegments = countPeopleOnSegments(segmentsBeforeNode);

    const trackCompositionsCopy = [...trackCompositions].filter(isRelevantForTrack(segmentsBeforeNode, trackId));

    trackCompositionsCopy.sort(sortByPeopleOnTrack(segmentsBeforeNode, peopleOnSegments));
    const indexOfTrack = trackCompositionsCopy.findIndex((track) => track.id === trackId);

    let numberOfPeopleWithHigherPriority = 0;

    const segmentsCountedAlready: string[] = [];
    trackCompositionsCopy.forEach((track, index) => {
        if (index < indexOfTrack) {
            const segmentIdOfTrack = segmentsBeforeNode.find((seg) => seg.trackId === track.id)?.segmentId;
            if (segmentIdOfTrack && !segmentsCountedAlready.includes(segmentIdOfTrack)) {
                segmentsCountedAlready.push(segmentIdOfTrack);
                numberOfPeopleWithHigherPriority += peopleOnSegments[segmentIdOfTrack] ?? 0;
            }
        }
    });

    return numberOfPeopleWithHigherPriority;
}

export function getExtraDelayOnTrack(
    track: TrackComposition,
    trackCompositions: TrackComposition[],
    participantsDelayInSeconds: number,
    nodeSpecifications: NodeSpecifications | undefined
): number {
    const trackNodes = listAllNodesOfTracks(trackCompositions);
    let delayForTrackInSeconds = 0;
    trackNodes.forEach((trackNode) => {
        const nodeInfluencesTrack = trackNode.segmentsBeforeNode.map((segments) => segments.trackId).includes(track.id);
        if (nodeInfluencesTrack) {
            if (
                nodeSpecifications &&
                nodeSpecifications[trackNode.segmentIdAfterNode] &&
                nodeSpecifications[trackNode.segmentIdAfterNode]?.trackOffsets
            ) {
                const nodeSpecification = nodeSpecifications[trackNode.segmentIdAfterNode];
                const foundOffsetRecord = Object.entries(nodeSpecification?.trackOffsets ?? {}).find(([segmentId]) =>
                    track.segments.map((segment) => segment.id).includes(segmentId)
                );
                if (foundOffsetRecord) {
                    console.log('This offset is played');
                    delayForTrackInSeconds -= foundOffsetRecord[1] * participantsDelayInSeconds;
                }
            } else {
                const peopleWithHigherPriority = sumUpAllPeopleWithHigherPriority(
                    trackCompositions,
                    trackNode,
                    track.id
                );
                delayForTrackInSeconds += peopleWithHigherPriority * participantsDelayInSeconds;
            }
        }
    });
    return -delayForTrackInSeconds;
}
