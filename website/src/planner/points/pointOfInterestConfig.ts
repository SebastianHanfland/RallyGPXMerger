import { PointOfInterestType } from '../store/types.ts';

export type PointOfInterestGroup = 'public' | 'todo' | 'impediment' | 'internal';
export type PointOfInterestMapShape = 'circle' | 'toilet';

export interface PointOfInterestConfig {
    group: PointOfInterestGroup;
    color?: string;
    mapShape: PointOfInterestMapShape;
}

export const pointOfInterestConfig: Record<PointOfInterestType, PointOfInterestConfig> = {
    [PointOfInterestType.TODO]: { group: 'todo', color: 'orange', mapShape: 'circle' },
    [PointOfInterestType.COMMENT]: { group: 'internal', color: 'yellow', mapShape: 'circle' },
    [PointOfInterestType.GAP]: { group: 'internal', color: 'red', mapShape: 'circle' },
    [PointOfInterestType.IMPEDIMENT]: { group: 'impediment', color: 'darkred', mapShape: 'circle' },
    [PointOfInterestType.TOILET]: { group: 'public', mapShape: 'toilet' },
    [PointOfInterestType.GATHERING]: { group: 'public', color: 'green', mapShape: 'circle' },
    [PointOfInterestType.PUBLIC_COMMENT]: { group: 'public', color: 'blue', mapShape: 'circle' },
    [PointOfInterestType.OTHER]: { group: 'internal', color: 'blue', mapShape: 'circle' },
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

export function isPublicPointType(type: PointOfInterestType): boolean {
    return pointOfInterestConfig[type].group === 'public';
}

export function getPointTypeMessageId(type: PointOfInterestType): string {
    return `msg.pointType.${type.toLowerCase()}`;
}
