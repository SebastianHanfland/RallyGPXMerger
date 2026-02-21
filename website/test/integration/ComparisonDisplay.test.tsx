import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, Mock, vi } from 'vitest';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { getLanguage } from '../../src/language';
import { getData } from '../../src/api/api';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';
import { RallyComparisonWrapper } from '../../src/comparison/RallyComparisonWrapper';
import { createComparisonStore } from '../../src/comparison/store/store';
import { StateOld } from '../../src/planner/store/typesOld';
import { migrateVersion1To2 } from '../../src/migrate/migrateVersion1To2';

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');

const ui = {
    isLoading: () => screen.getByText('Loading'),
};

describe('Comparison Display integration test', () => {
    it('Render the map display and have different snakes at different times', async () => {
        // given
        const buffer = '' + fs.readFileSync('./test/integration/data/RideOfSilence2024.json');
        const state = JSON.parse(buffer) as StateOld;
        const buffer2 = '' + fs.readFileSync('./test/integration/data/RideOfSilence2024.json');
        const state2 = JSON.parse(buffer2) as StateOld;

        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => 'planning-id,planning-id2');
        (getData as Mock).mockResolvedValue([migrateVersion1To2(state), migrateVersion1To2(state2)]);
        const store = createComparisonStore();
        const loadingPage = act(() =>
            render(
                <MemoryRouter>
                    <RallyComparisonWrapper store={store} />
                </MemoryRouter>
            )
        );
        ui.isLoading();
        await loadingPage;

        expect(getData).toHaveBeenCalledTimes(2);

        console.log({ state: store.getState() });
    });
});
