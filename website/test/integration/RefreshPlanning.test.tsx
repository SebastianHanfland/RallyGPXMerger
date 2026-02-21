import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Mock, vi, vitest } from 'vitest';
import { getLanguage } from '../../src/language';
import { getMessages } from '../../src/lang/getMessages';
import * as fs from 'node:fs';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getTrackCompositions } from '../../src/planner/store/trackMerge.reducer';
// The order of imports is important, the storage mock has to be set before the store is created
import { createPlanningStore } from '../../src/planner/store/planningStore';
import { getParsedGpxSegments } from '../../src/planner/store/segmentData.redux';
import { getCalculateTracks } from '../../src/planner/calculation/getCalculatedTracks';
import { storage } from '../../src/planner/store/storage';
import { migrateVersion1To2 } from '../../src/migrate/migrateVersion1To2';
import { State } from '../../src/planner/store/types';

const messages = getMessages('en');

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/planner/store/storage', () => ({
    storage: {
        load: () => {
            const buffer = '' + fs.readFileSync('./public/RideOfSilence2024-2.json');
            return JSON.parse(buffer) as State;
        },
        save: () => {},
    },
}));
vi.mock('../../src/planner/logic/resolving/street-new/geoApifyMapMatching', () => ({
    geoApifyFetchMapMatching: () => () => Promise.resolve({}),
}));
vi.mock('../../src/planner/logic/resolving/postcode/fetchPostCodeForCoordinate', () => ({
    fetchPostCodeForCoordinate: () => () => Promise.resolve({ postCode: '1234' }),
}));

describe('Refresh planning, when planning is in localStorage', () => {
    it('the parsed information should be available when reloading the page and the information resides in the localstorage at the start', async () => {
        const user = userEvent.setup();

        (getLanguage as Mock).mockImplementation(() => 'en');

        const store = createPlanningStore();

        const loadingPage = act(() =>
            render(
                <MemoryRouter>
                    <RallyPlannerWrapper store={store} />
                </MemoryRouter>
            )
        );

        const state1 = store.getState();
        await waitFor(() => expect(getCalculateTracks(store.getState()) ?? []).toHaveLength(1));
        expect(getTrackCompositions(store.getState())).toHaveLength(1);
        expect(getParsedGpxSegments(store.getState()) ?? []).toHaveLength(4);
    });
});
