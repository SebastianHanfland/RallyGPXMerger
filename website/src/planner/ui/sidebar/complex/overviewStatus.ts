import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getGaps } from '../../../calculation/getGaps.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { pointOfInterestTypesByGroup } from '../../../points/pointOfInterestConfig.ts';
import { wayPointHasUnknown } from '../../../streets/unknownUtil.ts';
import { getPoints } from '../../../store/points.reducer.ts';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { GapPoint, isTrackEntryPoint, PointOfInterest, TrackComposition } from '../../../store/types.ts';
import type { TrackStreetInfo } from '../../../logic/resolving/types.ts';

export const overviewAccordionDefinitions = [
    { key: 'checks', messageId: 'msg.checks' },
    { key: 'gaps', messageId: 'msg.gaps' },
    { key: 'points', messageId: 'msg.points' },
    { key: 'start', messageId: 'msg.startNameOverwrite' },
    { key: 'comStart', messageId: 'msg.communicatedStart' },
    { key: 'entryPoints', messageId: 'msg.entryPoints' },
] as const;

export type OverviewAccordionKey = (typeof overviewAccordionDefinitions)[number]['key'];

interface StatusValue {
    warning: boolean;
}

export interface OverviewAccordionStatuses {
    checks: StatusValue & { unknownCount: number };
    gaps: StatusValue & { gapCount: number };
    points: StatusValue & {
        todoCount: number;
        impedimentCount: number;
        pointCount: number;
        publicPointCount: number;
    };
    start: StatusValue & { unknownStartNameCount: number };
    comStart: StatusValue & { unconfiguredTrackCount: number };
    entryPoints: StatusValue & { incompleteEntryPointCount: number };
}

interface OverviewStatusInput {
    tracks: TrackComposition[];
    trackStreetInfos: TrackStreetInfo[];
    gaps: GapPoint[];
    points: PointOfInterest[];
    unknownStreetName: string;
}

export function calculateOverviewAccordionStatuses({
    tracks,
    trackStreetInfos,
    gaps,
    points,
    unknownStreetName,
}: OverviewStatusInput): OverviewAccordionStatuses {
    const unknownCount = trackStreetInfos.reduce(
        (counter, info) =>
            counter + info.wayPoints.filter((waypoint) => wayPointHasUnknown(waypoint, unknownStreetName)).length,
        0
    );

    const todoCount = points.filter((point) => pointOfInterestTypesByGroup.todo.includes(point.type)).length;
    const impedimentCount = points.filter((point) =>
        pointOfInterestTypesByGroup.impediment.includes(point.type)
    ).length;
    const publicPointCount = points.filter((point) => pointOfInterestTypesByGroup.public.includes(point.type)).length;
    const pointCount = points.length;

    const unknownStartNameCount = tracks.filter((track) => {
        const trackInfo = trackStreetInfos.find((info) => info.id === track.id);
        const firstStreetName = trackInfo?.wayPoints[0]?.streetName;
        const isUnknown = !firstStreetName || firstStreetName === unknownStreetName;
        const hasOverwrite = Boolean(track.startName?.trim());
        return isUnknown && !hasOverwrite;
    }).length;

    const unconfiguredTrackCount = tracks.filter(
        (track) => track.buffer === undefined && track.rounding === undefined
    ).length;

    const entryPoints = tracks.flatMap((track) => track.segments.filter(isTrackEntryPoint));
    const incompleteEntryPointCount = entryPoints.filter(
        (entryPoint) =>
            !entryPoint.streetName?.trim() || (entryPoint.buffer === undefined && entryPoint.rounding === undefined)
    ).length;

    return {
        checks: { warning: unknownCount > 0, unknownCount },
        gaps: { warning: gaps.length > 0, gapCount: gaps.length },
        points: {
            warning: todoCount + impedimentCount > 0,
            todoCount,
            impedimentCount,
            pointCount,
            publicPointCount,
        },
        start: { warning: unknownStartNameCount > 0, unknownStartNameCount },
        comStart: { warning: unconfiguredTrackCount > 0, unconfiguredTrackCount },
        entryPoints: { warning: incompleteEntryPointCount > 0, incompleteEntryPointCount },
    };
}

export function getWarningAccordionDefinitions(statuses: OverviewAccordionStatuses) {
    return overviewAccordionDefinitions.filter(({ key }) => statuses[key].warning);
}

export function useOverviewAccordionStatuses() {
    const intl = useIntl();

    return calculateOverviewAccordionStatuses({
        tracks: useSelector(getTrackCompositions),
        trackStreetInfos: useSelector(getTrackStreetInfos),
        gaps: useSelector(getGaps),
        points: useSelector(getPoints),
        unknownStreetName: intl.formatMessage({ id: 'msg.unknown' }),
    });
}
