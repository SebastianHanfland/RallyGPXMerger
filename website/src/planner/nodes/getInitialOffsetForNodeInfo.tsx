import {
    getNodeEditInfo,
    getNodeSpecifications,
    getParticipantsDelay,
    getTrackCompositions,
} from '../store/trackMerge.reducer.ts';
import { sumUpAllPeopleWithHigherPriority } from '../logic/calculate/helper/peopleDelayCounter.ts';
import { listAllNodesOfTracks, TrackNode } from '../logic/calculate/helper/nodeFinder.ts';
import { createSelector } from '@reduxjs/toolkit';
import { TrackComposition } from '../store/types.ts';

interface NodeSpecifications {
    trackOffsets: Record<string, number>;
    nodeInfo?: string;
    totalCount: number;
}

export function getTracksAtNode(foundNode: TrackNode, trackCompositions: TrackComposition[]): TrackComposition[] {
    return trackCompositions.filter((track) =>
        track.segments.map((segment) => segment.id).includes(foundNode.segmentIdAfterNode)
    );
}

export const getInitialTrackOffsetsAtNode = createSelector(
    getNodeEditInfo,
    getTrackCompositions,
    getParticipantsDelay,
    getNodeSpecifications,
    (nodeInfo, tracks, participantsDelay, nodeSpecifications): NodeSpecifications | undefined => {
        const trackNodes = listAllNodesOfTracks(tracks);
        if (nodeInfo?.segmentAfterId && nodeSpecifications) {
            const nodeSpecification = nodeSpecifications[nodeInfo?.segmentAfterId];
            console.log('here?');
            if (nodeSpecification) {
                console.log('here as well?');
                return nodeSpecification;
            }
        }
        console.log('or even here?');
        const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === nodeInfo?.segmentAfterId);
        if (!foundTrackNode) {
            return;
        }
        const tracksAtNode = getTracksAtNode(foundTrackNode, tracks);

        let totalCount = 0;
        const countInfos = tracksAtNode.map((track) => {
            totalCount = totalCount + (track?.peopleCount ?? 0);
            const peopleBefore = sumUpAllPeopleWithHigherPriority(tracks, foundTrackNode, track.id);
            return { id: track.id, name: track.name, peopleCount: track.peopleCount ?? 0, initialOffset: peopleBefore };
        });
        const initialOffsets: Record<string, number> = {};

        countInfos.forEach((countInfo) => {
            initialOffsets[countInfo.id] = countInfo.initialOffset * participantsDelay;
        });
        return { trackOffsets: initialOffsets, totalCount: totalCount * participantsDelay };
    }
);
