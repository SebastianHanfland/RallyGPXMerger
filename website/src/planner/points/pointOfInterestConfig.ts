import { PointOfInterestType } from '../store/types.ts';

export type PointOfInterestGroup = 'public' | 'todo' | 'impediment' | 'internal';
export type PointOfInterestDialogGroup = 'open' | 'internal' | 'public';
export type PointOfInterestMapShape = 'circle' | 'toilet';

export interface PointOfInterestConfig {
    group: PointOfInterestGroup;
    dialogGroup: PointOfInterestDialogGroup;
    selectable: boolean;
    color?: string;
    mapShape: PointOfInterestMapShape;
}

export const pointOfInterestConfig: Record<PointOfInterestType, PointOfInterestConfig> = {
    [PointOfInterestType.TODO]: {
        group: 'todo',
        dialogGroup: 'open',
        selectable: true,
        color: 'orange',
        mapShape: 'circle',
    },
    [PointOfInterestType.COMMENT]: {
        group: 'internal',
        dialogGroup: 'internal',
        selectable: true,
        color: 'yellow',
        mapShape: 'circle',
    },
    [PointOfInterestType.GAP]: {
        group: 'internal',
        dialogGroup: 'internal',
        selectable: false,
        color: 'red',
        mapShape: 'circle',
    },
    [PointOfInterestType.IMPEDIMENT]: {
        group: 'impediment',
        dialogGroup: 'open',
        selectable: true,
        color: 'darkred',
        mapShape: 'circle',
    },
    [PointOfInterestType.TOILET]: { group: 'public', dialogGroup: 'public', selectable: true, mapShape: 'toilet' },
    [PointOfInterestType.GATHERING]: {
        group: 'public',
        dialogGroup: 'public',
        selectable: true,
        color: 'green',
        mapShape: 'circle',
    },
    [PointOfInterestType.PUBLIC_COMMENT]: {
        group: 'public',
        dialogGroup: 'public',
        selectable: true,
        color: 'blue',
        mapShape: 'circle',
    },
    [PointOfInterestType.OTHER]: {
        group: 'internal',
        dialogGroup: 'internal',
        selectable: true,
        color: 'blue',
        mapShape: 'circle',
    },
};

export const pointOfInterestColors = Object.fromEntries(
    Object.entries(pointOfInterestConfig).map(([type, config]) => [type, config.color])
) as Record<PointOfInterestType, string | undefined>;

export const pointOfInterestTypesByGroup: Record<PointOfInterestGroup, PointOfInterestType[]> = {
    public: Object.values(PointOfInterestType).filter((type) => pointOfInterestConfig[type].group === 'public'),
    todo: Object.values(PointOfInterestType).filter((type) => pointOfInterestConfig[type].group === 'todo'),
    impediment: Object.values(PointOfInterestType).filter((type) => pointOfInterestConfig[type].group === 'impediment'),
    internal: Object.values(PointOfInterestType).filter((type) => pointOfInterestConfig[type].group === 'internal'),
};

export const pointOfInterestTypesByDialogGroup: Record<PointOfInterestDialogGroup, PointOfInterestType[]> = {
    open: Object.values(PointOfInterestType).filter(
        (type) => pointOfInterestConfig[type].selectable && pointOfInterestConfig[type].dialogGroup === 'open'
    ),
    internal: Object.values(PointOfInterestType).filter(
        (type) => pointOfInterestConfig[type].selectable && pointOfInterestConfig[type].dialogGroup === 'internal'
    ),
    public: Object.values(PointOfInterestType).filter(
        (type) => pointOfInterestConfig[type].selectable && pointOfInterestConfig[type].dialogGroup === 'public'
    ),
};

export const DEFAULT_POINT_OF_INTEREST_TYPE = PointOfInterestType.OTHER;
export const DEFAULT_POINT_OF_INTEREST_RADIUS_IN_M = 200;

export function isPublicPointType(type: PointOfInterestType): boolean {
    return pointOfInterestConfig[type].group === 'public';
}

export function getPointTypeMessageId(type: PointOfInterestType): string {
    return `msg.pointType.${type.toLowerCase()}`;
}
