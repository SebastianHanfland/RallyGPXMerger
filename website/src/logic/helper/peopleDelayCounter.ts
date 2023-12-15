import { TrackComposition } from '../../store/types.ts';
import { listAllNodesOfTracks, TrackNode } from './nodeFinder.ts';
import { shiftEndDate } from '../../utils/dateUtil.ts';
import { PARTICIPANTS_DELAY_IN_SECONDS } from '../../store/trackMerge.reducer.ts';

export const DELAY_PER_PERSON_IN_SECONDS = 0.2;

export function sumUpAllPeopleWithHigherPriority(
    segments: { segmentId: string; trackId: string; amount?: number }[],
    trackId: string
): number {
    const segmentsCopy = [...segments];
    segmentsCopy.sort((a, b) => ((a.amount ?? 0) > (b.amount ?? 0) ? -1 : 1));
    const indexOfTrack = segmentsCopy.findIndex((segment) => segment.trackId === trackId);

    let numberOfPeopleWithHigherPriority = 0;

    segmentsCopy.forEach((segment, index) => {
        if (index < indexOfTrack) {
            numberOfPeopleWithHigherPriority += segment.amount ?? 0;
        }
    });

    return numberOfPeopleWithHigherPriority;
}

export function sumUpAllPeopleWithHigherPriority2(
    trackCompositions: TrackComposition[],
    trackNode: TrackNode,
    trackId: string
): number {
    const { segmentIdAfterNode, segmentsBeforeNode } = trackNode;

    if (!segmentsBeforeNode.find((seg) => seg.trackId === trackId)) {
        return 0;
    }
    // grouping by segment ids
    // {
    //     segmentsBeforeNode: [
    //         { segmentId: 'A1', trackId: '1', amount: 200 },
    //         { segmentId: 'B1', trackId: '2', amount: 300 },
    //     ],
    //         segmentIdAfterNode: 'AB',
    // },
    // {
    //     segmentsBeforeNode: [
    //         { segmentId: 'AB', trackId: '1', amount: 200 },
    //         { segmentId: 'AB', trackId: '2', amount: 300 },
    //         { segmentId: 'C1', trackId: '3', amount: 400 },
    //     ],
    //         segmentIdAfterNode: 'ABC',
    // },

    const peopleOnBranch: Record<string, number> = {};
    segmentsBeforeNode.forEach((segment) => {
        if (peopleOnBranch[segment.segmentId] !== undefined) {
            peopleOnBranch[segment.segmentId] += segment.amount ?? 0;
        } else {
            peopleOnBranch[segment.segmentId] = segment.amount ?? 0;
        }
    });

    console.log(peopleOnBranch, segmentIdAfterNode);

    const trackCompositionsCopy = [...trackCompositions].filter((track) => {
        if (track.id === trackId) {
            return true;
        }
        const segmentIdOfOtherTrack = segmentsBeforeNode.find((seg) => seg.trackId === track.id)?.segmentId;
        const segmentIdOfTrack = segmentsBeforeNode.find((seg) => seg.trackId === trackId)?.segmentId;
        return segmentIdOfOtherTrack !== segmentIdOfTrack;
    });
    console.log(trackCompositionsCopy);
    trackCompositionsCopy.sort((tA, tB) => {
        const segmentA = segmentsBeforeNode.find((seg) => seg.trackId === tA.id)?.segmentId;
        const segmentB = segmentsBeforeNode.find((seg) => seg.trackId === tB.id)?.segmentId;
        if (!segmentA) {
            return 1;
        }
        if (!segmentB) {
            return -1;
        }
        return peopleOnBranch[segmentA] > peopleOnBranch[segmentB] ? -1 : 1;
    });
    const indexOfTrack = trackCompositionsCopy.findIndex((track) => track.id === trackId);
    // We have all the different tracks
    // Situations are interesting where the same segment ids appear
    // nodes have to be found any ways

    let numberOfPeopleWithHigherPriority = 0;

    const segmentsCountedAlready: string[] = [];
    trackCompositionsCopy.forEach((track, index) => {
        if (index < indexOfTrack) {
            const segmentIdOfTrack = segmentsBeforeNode.find((seg) => seg.trackId === track.id)?.segmentId;
            if (segmentIdOfTrack && !segmentsCountedAlready.includes(segmentIdOfTrack)) {
                segmentsCountedAlready.push(segmentIdOfTrack);
                numberOfPeopleWithHigherPriority += peopleOnBranch[segmentIdOfTrack] ?? 0;
            }
        }
    });

    return numberOfPeopleWithHigherPriority;
}

export function getAdjustedArrivalDateTime(
    arrivalDateTime: string,
    track: TrackComposition,
    trackCompositions: TrackComposition[]
) {
    const trackNodes = listAllNodesOfTracks(trackCompositions);
    let delayForTrackInMinutes = 0;
    trackNodes.forEach((trackNode) => {
        const nodeInfluencesTrack = trackNode.segmentsBeforeNode.map((segments) => segments.trackId).includes(track.id);
        if (nodeInfluencesTrack) {
            const peopleWithHigherPriority = sumUpAllPeopleWithHigherPriority2(trackCompositions, trackNode, track.id);
            delayForTrackInMinutes += (peopleWithHigherPriority * PARTICIPANTS_DELAY_IN_SECONDS) / 60;
        }
    });
    return shiftEndDate(arrivalDateTime, -delayForTrackInMinutes);
}
