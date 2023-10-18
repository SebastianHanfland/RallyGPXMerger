import { expect } from 'vitest';

describe('Suite', () => {
    test('simple test', () => {
        // given

        // when

        // then
        expect(true).toEqual(true);
    });

    describe('test block', () => {
        const testCases = [
            { a: 5, b: 7, c: 12 },
            { a: 7, b: 7, c: 14 },
            { a: 10, b: 7, c: 17 },
        ];

        testCases.forEach(({ a, b, c }) =>
            it(`${a} + ${b} = ${c}`, () => {
                // when
                const result = a + b;
                // then
                expect(result).toEqual(c);
            })
        );
    });
});
