import { getTimeDifferenceInSeconds } from '../dateUtil.ts';

describe('dateUtil', () => {
    it('should calculate difference in seconds and shift date accordingly', () => {
        // given
        const firstDateString = '2007-10-14T10:09:57.000Z';
        const secondDateString = '2007-10-14T11:10:57.000Z';

        // when
        const differenceInSeconds = getTimeDifferenceInSeconds(firstDateString, secondDateString);

        // then
        expect(differenceInSeconds).toEqual(-(60 * 60 + 60)); // 3600 + 60 = 3660
    });

    it('should take day light saving into account', () => {
        // given
        const firstDateString = '2007-10-14T10:09:57.000Z';
        const secondDateString = '2007-11-14T10:09:57.000Z';

        // when
        const differenceInSeconds = getTimeDifferenceInSeconds(firstDateString, secondDateString);

        // then
        const secondsOfHour = 60 * 60;
        const secondsOfADay = 24 * secondsOfHour;
        expect(differenceInSeconds).toEqual(-(31 * secondsOfADay - secondsOfHour)); // 3600 + 60 = 3660
    });
});
