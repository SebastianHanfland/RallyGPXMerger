import { formatSegmentSpeedInput, isForcedSegmentSpeed, parseSegmentSpeedInput } from '../segmentSpeedUtil.ts';

describe('parseSegmentSpeedInput', () => {
    it.each([
        { description: 'plain integer', input: '20', expected: { speed: 20, forced: false } },
        { description: 'plain decimal', input: '12.5', expected: { speed: 12.5, forced: false } },
        { description: 'trailing force marker', input: '20!', expected: { speed: 20, forced: true } },
        { description: 'leading force marker', input: '!20', expected: { speed: 20, forced: true } },
        { description: 'force marker on both sides', input: '!20!', expected: { speed: 20, forced: true } },
        { description: 'trailing marker with decimal', input: '12.5!', expected: { speed: 12.5, forced: true } },
        { description: 'leading marker with spaces', input: ' !20 ', expected: { speed: 20, forced: true } },
        { description: 'trailing marker with spaces', input: '20 ! ', expected: { speed: 20, forced: true } },
        { description: 'negative value', input: '-3', expected: { speed: 0, forced: false } },
        { description: 'negative value with marker', input: '!-3', expected: { speed: 0, forced: false } },
        { description: 'empty value', input: '', expected: { speed: undefined, forced: false } },
        { description: 'only force marker', input: '!', expected: { speed: undefined, forced: false } },
        { description: 'non-numeric value', input: 'abc', expected: { speed: undefined, forced: false } },
        { description: 'non-numeric value with marker', input: 'abc!', expected: { speed: undefined, forced: false } },
    ])('parses $description ($input)', ({ input, expected }) => {
        expect(parseSegmentSpeedInput(input)).toEqual(expected);
    });
});

describe('formatSegmentSpeedInput', () => {
    it.each([
        { speed: 20, forced: false, expected: '20' },
        { speed: 20, forced: true, expected: '20!' },
        { speed: 12.5, forced: true, expected: '12.5!' },
        { speed: undefined, forced: true, expected: '' },
        { speed: 0, forced: true, expected: '' },
    ])('formats speed $speed forced=$forced as $expected', ({ speed, forced, expected }) => {
        expect(formatSegmentSpeedInput(speed, forced)).toEqual(expected);
    });
});

describe('isForcedSegmentSpeed', () => {
    it('is true only when a positive custom speed is marked forced', () => {
        expect(isForcedSegmentSpeed({ a: true }, { a: 20 }, 'a')).toBe(true);
        expect(isForcedSegmentSpeed({ a: true }, { a: 20 }, 'b')).toBe(false);
        expect(isForcedSegmentSpeed({ a: false }, { a: 20 }, 'a')).toBe(false);
        expect(isForcedSegmentSpeed({ a: true }, { a: 0 }, 'a')).toBe(false);
        expect(isForcedSegmentSpeed(undefined, { a: 20 }, 'a')).toBe(false);
    });
});
