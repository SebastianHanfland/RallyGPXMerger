import { NodeSpecification } from '../../../planner/store/types.ts';

export function getNodeOffset(
    nodeSpecification: NodeSpecification,
    segmentId: string,
    branchSize: number,
    total: number
): number {
    if (nodeSpecification.trackOffsetPercentages !== undefined) {
        const percentage = nodeSpecification.trackOffsetPercentages[segmentId] ?? 0;
        const remainingPeople = Math.max(0, total - branchSize);
        const boundedPercentage = Math.max(0, Math.min(100, percentage));
        return Math.round((remainingPeople * boundedPercentage) / 100);
    } else {
        return nodeSpecification.trackOffsets?.[segmentId] ?? 0;
    }
}

export function getNodeOffsetPercentage(
    nodeSpecification: NodeSpecification,
    segmentId: string,
    branchSize: number,
    total: number
): number {
    if (nodeSpecification.trackOffsetPercentages !== undefined) {
        return nodeSpecification.trackOffsetPercentages[segmentId] ?? 0;
    }

    const remainingPeople = Math.max(0, total - branchSize);
    const offset = nodeSpecification.trackOffsets?.[segmentId] ?? 0;
    return remainingPeople === 0 ? 0 : Math.max(0, Math.min(100, (offset / remainingPeople) * 100));
}

export function setNodeOffsetPercentage(
    nodeSpecification: NodeSpecification,
    segmentId: string,
    percentage: number
): NodeSpecification {
    const percentageNodeSpecification = { ...nodeSpecification };
    delete percentageNodeSpecification.trackOffsets;
    percentageNodeSpecification.trackOffsetPercentages = {
        ...(nodeSpecification.trackOffsetPercentages ?? {}),
        [segmentId]: percentage,
    };
    return percentageNodeSpecification;
}
