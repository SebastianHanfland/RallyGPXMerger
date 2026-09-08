import { PointOfInterestType } from '../../store/types.ts';
import {
    DEFAULT_POINT_OF_INTEREST_RADIUS_IN_M,
    DEFAULT_POINT_OF_INTEREST_TYPE,
    isPublicPointType,
    pointOfInterestConfig,
    pointOfInterestTypesByDialogGroup,
    pointOfInterestTypesByGroup,
} from '../pointOfInterestConfig.ts';

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

    it('provides the three dialog groups and new point defaults', () => {
        expect(pointOfInterestTypesByDialogGroup.open).toEqual([
            PointOfInterestType.TODO,
            PointOfInterestType.IMPEDIMENT,
        ]);
        expect(pointOfInterestTypesByDialogGroup.internal).toEqual([
            PointOfInterestType.COMMENT,
            PointOfInterestType.OTHER,
        ]);
        expect(pointOfInterestTypesByDialogGroup.public).toEqual([
            PointOfInterestType.TOILET,
            PointOfInterestType.GATHERING,
            PointOfInterestType.PUBLIC_COMMENT,
        ]);
        expect(DEFAULT_POINT_OF_INTEREST_TYPE).toBe(PointOfInterestType.OTHER);
        expect(DEFAULT_POINT_OF_INTEREST_RADIUS_IN_M).toBe(200);
        expect(pointOfInterestConfig[PointOfInterestType.GAP].selectable).toBe(false);
    });
});
