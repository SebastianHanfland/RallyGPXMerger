import { PointOfInterestType } from '../../store/types.ts';
import { isPublicPointType, pointOfInterestConfig, pointOfInterestTypesByGroup } from '../pointOfInterestConfig.ts';

describe('point of interest configuration', () => {
    it('classifies public points and keeps internal points private', () => {
        expect(pointOfInterestTypesByGroup.public).toEqual([
            PointOfInterestType.TOILET,
            PointOfInterestType.GATHERING,
            PointOfInterestType.PUBLIC_COMMENT,
        ]);
        expect(pointOfInterestTypesByGroup.internal).toEqual([
            PointOfInterestType.COMMENT,
            PointOfInterestType.GAP,
            PointOfInterestType.OTHER,
        ]);
        expect(isPublicPointType(PointOfInterestType.PUBLIC_COMMENT)).toBe(true);
        expect(isPublicPointType(PointOfInterestType.OTHER)).toBe(false);
    });

    it('keeps todos and impediments in separate groups', () => {
        expect(pointOfInterestTypesByGroup.todo).toEqual([PointOfInterestType.TODO]);
        expect(pointOfInterestTypesByGroup.impediment).toEqual([PointOfInterestType.IMPEDIMENT]);
        expect(pointOfInterestConfig[PointOfInterestType.TODO].color).toBe('orange');
        expect(pointOfInterestConfig[PointOfInterestType.IMPEDIMENT].color).toBe('darkred');
    });
});
