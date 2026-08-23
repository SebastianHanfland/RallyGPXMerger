import { expectedStreet } from '../../fixtureHelpers.ts';

export default [
    expectedStreet(48.1, 11.1, 'First Street'),
    expectedStreet(48.1001, 11.1001, 'First Street'),
    expectedStreet(48.1002, 11.1002, 'Second Street'),
    expectedStreet(48.1003, 11.1003, 'Second Street'),
];
