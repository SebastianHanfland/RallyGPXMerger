import { isSameStreetName } from '../isSameStreetName.ts';

function createTestCase(street1: string, street2: string, expected: boolean) {
    return {
        street1: street1,
        street2: street2,
        expected: expected,
        description: `should see "${street1}" and "${street2}" as ${expected ? '' : 'not '}equal`,
    };
}

describe('isSameStreetName', () => {
    const testCases = [
        createTestCase('', '', true),
        createTestCase('Street', 'Street', true),
        createTestCase('Street, EBE1', 'LStre3et, EBE1', true),
        createTestCase('Berliner, Straße', 'Frankfurter, Straße', true),
        createTestCase('Berliner Straße', 'Frankfurter Straße', false),
        createTestCase(' Street', 'Street', true),
        createTestCase('B 2', 'B 2, E345', true),
        createTestCase('B 2R', '(Tunnel) B 2R', true),
    ];

    testCases.forEach((testCase) =>
        it(testCase.description, () => {
            // when
            const isSame = isSameStreetName(testCase.street1, testCase.street2);

            // then
            expect(isSame).toEqual(testCase.expected);
        })
    );
});
