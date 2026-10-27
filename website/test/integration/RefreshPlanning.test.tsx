import { act, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import * as fs from 'node:fs';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getTrackCompositions } from '../../src/planner/store/trackMerge.reducer';
// The order of imports is important, the storage mock has to be set before the store is created
import { createPlanningStore } from '../../src/planner/store/planningStore';
import { getParsedGpxSegments } from '../../src/planner/store/segmentData.redux';
import { getCalculateTracks } from '../../src/planner/calculation/getCalculatedTracks';
import { State } from '../../src/planner/store/types';

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/planner/store/storage', () => ({
    storage: {
        load: () => {
            const buffer = '' + fs.readFileSync('./test/integration/data/RideOfSilence2024-2.json');
            return JSON.parse(buffer) as State;
        },
        save: () => {},
    },
}));
vi.mock('../../src/planner/logic/resolving/streets/geoApifyMapMatching', () => ({
    geoApifyFetchMapMatching: () => () => Promise.resolve({}),
}));
vi.mock('../../src/planner/logic/resolving/postcode/fetchPostCodeForCoordinate', () => ({
    fetchPostCodeForCoordinate: () => () => Promise.resolve({ postCode: '1234' }),
}));

describe('Refresh planning, when planning is in localStorage', () => {
    it('the parsed information should be available when reloading the page and the information resides in the localstorage at the start', async () => {
        (getLanguage as Mock).mockImplementation(() => 'en');

        const store = createPlanningStore();

        act(() =>
            render(
                <MemoryRouter>
                    <RallyPlannerWrapper store={store} />
                </MemoryRouter>
            )
        );

        await waitFor(() => expect(getCalculateTracks(store.getState()) ?? []).toHaveLength(1));
        expect(getTrackCompositions(store.getState())).toHaveLength(1);
        expect(getParsedGpxSegments(store.getState()) ?? []).toHaveLength(4);
    });
});
