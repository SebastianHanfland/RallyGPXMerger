import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { getLanguage } from '../../src/language';
import { getMessages } from '../../src/lang/getMessages';
import { createPlanningStore } from '../../src/planner/store/planningStore';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { plannerUi as ui } from './data/PlannerTestAccess';
import { RallyPlannerWrapper } from '../../src/planner/RallyPlanner';
import { getTrackCompositions } from '../../src/planner/store/trackMerge.reducer';
import { getParsedGpxSegments } from '../../src/planner/store/segmentData.redux';

import { calculateTracks } from '../../src/common/calculation/calculated-tracks/calculateTracks';
import { getCalculateTracks } from '../../src/planner/calculation/getCalculatedTracks';

const messages = getMessages('en');

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/planner/logic/resolving/street-new/geoApifyMapMatching', () => ({
    geoApifyFetchMapMatching: () => () => Promise.resolve({}),
}));
vi.mock('../../src/planner/logic/resolving/postcode/fetchPostCodeForCoordinate', () => ({
    fetchPostCodeForCoordinate: () => () => Promise.resolve({ postCode: '1234' }),
}));

describe('Import planning', () => {
    it('import a simple planning and check that everything is properly set', async () => {
        const buffer = '' + fs.readFileSync('./test/integration/data/RideOfSilence2024.json');
        const state = JSON.parse(buffer) as State;
        const user = userEvent.setup();

        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => undefined);
        const store = createPlanningStore();

        const loadingPage = act(() =>
            render(
                <MemoryRouter>
                    <RallyPlannerWrapper store={store} />
                </MemoryRouter>
            )
        );

        await user.click(ui.importPlanButton());
        const file = new File([JSON.stringify(state)], 'state.json', { type: 'application/json' });
        file.text = () => Promise.resolve(JSON.stringify(state));
        await user.upload(ui.uploadNode(), file);

        await waitFor(() => expect(getCalculateTracks(store.getState()) ?? []).toHaveLength(1));
        expect(getTrackCompositions(store.getState())).toHaveLength(1);
        expect(getParsedGpxSegments(store.getState()) ?? []).toHaveLength(4);
    });
});
