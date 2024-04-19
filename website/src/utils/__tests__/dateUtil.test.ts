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
                description: 'Should subtract 15 minutes and round down to full 15 minutes for M routes',
                input: '2007-10-14T10:09:57.000Z',
                trackName: 'M1',
                output: '2007-10-14T09:45:00.000Z',
            },
            {
                description: 'Should subtract 15 minutes and round down to full 15 minutes for M routes',
                input: '2007-10-14T10:15:00.000Z',
                trackName: 'M1',
                output: '2007-10-14T10:00:00.000Z',
            },
            {
                description: 'Should subtract 10 minutes and round down to full 5 minutes for A routes',
                input: '2007-10-14T10:10:00.000Z',
                trackName: 'A9',
                output: '2007-10-14T10:00:00.000Z',
            },
            {
                description: 'Should subtract 10 minutes and round down to full 5 minutes for A routes',
                input: '2007-10-14T10:09:57.000Z',
                trackName: 'A9',
                output: '2007-10-14T09:55:00.000Z',
            },
        ];

        testCases.forEach(({ output, input, trackName, description }) =>
            it(`${description}: ${input} -> ${output}`, () => {
                expect(roundStartTimes(input, trackName)).toEqual(output);
            })
        );
    });
});
