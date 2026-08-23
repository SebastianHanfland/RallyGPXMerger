import { expectedStreet } from '../../fixtureHelpers.ts';

export default [
    expectedStreet(48.2, 11.2, 'First Street'),
    expectedStreet(48.2001, 11.2001, 'First Street'),
    expectedStreet(48.2002, 11.2002, 'First Street'),
    expectedStreet(48.2003, 11.2003, 'Second Street'),
    expectedStreet(48.2004, 11.2004, 'Second Street'),
];
