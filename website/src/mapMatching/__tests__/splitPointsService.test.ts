import { splitListIntoSections } from '../splitPointsService.ts';

describe('splitPointsService', () => {
    it('should split lists', () => {
        // given
        const longList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // when
        const listOfLists = splitListIntoSections(longList, 3);

        // then
        expect(listOfLists).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
    });
});
