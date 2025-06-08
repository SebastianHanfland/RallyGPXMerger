import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { getMessages } from '../../src/lang/getMessages';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getTrackCompositions } from '../../src/planner/store/trackMerge.reducer';
import { getGpxSegments } from '../../src/planner/store/gpxSegments.reducer';
// The order of imports is important, the storage mock has to be set before the store is created
import { storage } from '../../src/planner/store/storage';
import { createPlanningStore } from '../../src/planner/store/planningStore';
import { getParsedGpxSegments } from '../../src/planner/new-store/segmentData.redux';
import { getCalculatedTracks } from '../../src/planner/store/calculatedTracks.reducer';

const messages = getMessages('en');

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/planner/store/storage', () => ({
    storage: {
        load: () => {
            const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
            return JSON.parse(buffer) as State;
        },
        save: () => {},
    },
}));
vi.mock('../../src/versions/cache/readableTracks');
vi.mock('../../src/planner/logic/resolving/streets/mapMatchingStreetResolver');
vi.mock('../../src/planner/logic/resolving/postcode/postCodeResolver', () => ({
    addPostCodeToStreetInfos: () => Promise.resolve(),
}));

describe('Refresh planning, when planning is in localStorage', () => {
    it('the parsed information should be available when reloading the page and the information resides in the localstorage at the start', async () => {
        const user = userEvent.setup();

        (getLanguage as Mock).mockImplementation(() => 'en');
        const store = createPlanningStore();
        const state2 = store.getState();
        const state1 = storage.load();

        const loadingPage = act(() =>
            render(
                <MemoryRouter>
                    <RallyPlannerWrapper store={store} />
                </MemoryRouter>
            )
        );

        await waitFor(() => expect(getCalculatedTracks(store.getState()) ?? []).toHaveLength(1));
        expect(getTrackCompositions(store.getState())).toHaveLength(1);
        expect(getParsedGpxSegments(store.getState()) ?? []).toHaveLength(4);
        expect(getGpxSegments(store.getState()) ?? []).toHaveLength(4);
    });
});
