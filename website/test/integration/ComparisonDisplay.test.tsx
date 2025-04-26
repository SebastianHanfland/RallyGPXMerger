import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { expect, Mock, vi } from 'vitest';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { getLanguage } from '../../src/language';
import { getData } from '../../src/api/api';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';
import { createDisplayStore } from '../../src/versions/store/store';
import { RallyDisplayWrapper } from '../../src/versions/RallyDisplayWrapper';
import { getBikeSnakesForDisplayMap } from '../../src/versions/map/dataReading';
import { mapActions } from '../../src/versions/store/map.reducer';
import { RallyComparisonWrapper } from '../../src/comparison/RallyComparisonWrapper';

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');

const ui = {
    isLoading: () => screen.getByText('Loading'),
};

describe('Comparison Display integration test', () => {
    it('Render the map display and have different snakes at different times', async () => {
        // given
        const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        const state = JSON.parse(buffer) as State;
        const buffer2 = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        const state2 = JSON.parse(buffer2) as State;

        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => 'planning-id,planning-id2');
        (getData as Mock).mockResolvedValue([{ data: state }, { data: state2 }]);
        const store = createDisplayStore();
        const loadingPage = act(() =>
            render(
                <BrowserRouter>
                    <RallyComparisonWrapper store={store} />
                </BrowserRouter>
            )
        );
        ui.isLoading();
        await loadingPage;

        expect(getData).toHaveBeenCalledTimes(2);

        console.log({ state: store.getState() });
    });
});
