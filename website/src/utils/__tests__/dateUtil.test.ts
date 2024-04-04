import { getTimeDifferenceInSeconds, roundStartTimes } from '../dateUtil.ts';

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

    // TODO #17 fix time zone in pipeline
    it.skip('should take day light saving into account', () => {
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

    describe('roundStartTimes', () => {
        const testCases = [
            {
                input: '2007-10-14T10:09:57.000Z',
                output: '2007-10-14T09:55:00.000Z',
            },
            {
                input: '2007-10-14T10:10:00.000Z',
                output: '2007-10-14T10:00:00.000Z',
            },
        ];

        testCases.forEach(({ output, input }) =>
            it(`${input} -> ${output}`, () => {
                expect(roundStartTimes(input)).toEqual(output);
            })
        );
    });
});
