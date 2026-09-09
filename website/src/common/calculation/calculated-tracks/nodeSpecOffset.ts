import { NodeSpecification } from '../../../planner/store/types.ts';

export function getNodeOffset(
    nodeSpecification: NodeSpecification,
    segmentId: string,
    branchSize: number,
    total: number
): number {
    const percentage = nodeSpecification.trackOffsetPercentages?.[segmentId];
    if (percentage === undefined) {
        return nodeSpecification.trackOffsets[segmentId] ?? 0;
    }

    const remainingPeople = Math.max(0, total - branchSize);
    const boundedPercentage = Math.max(0, Math.min(100, percentage));
    return Math.round((remainingPeople * boundedPercentage) / 100);
}

export function getNodeOffsetPercentage(
    nodeSpecification: NodeSpecification,
    segmentId: string,
    branchSize: number,
    total: number
): number {
    const percentage = nodeSpecification.trackOffsetPercentages?.[segmentId];
    if (percentage !== undefined) {
        return percentage;
    }

    const remainingPeople = Math.max(0, total - branchSize);
    const offset = nodeSpecification.trackOffsets[segmentId] ?? 0;
    return remainingPeople === 0 ? 0 : Math.max(0, Math.min(100, (offset / remainingPeople) * 100));
}
