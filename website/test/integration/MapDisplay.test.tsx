import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, Mock, vi } from 'vitest';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { getLanguage } from '../../src/language';
import { getData } from '../../src/api/api';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';
import { createDisplayStore } from '../../src/display/store/store';
import { RallyDisplayWrapper } from '../../src/display/RallyDisplayWrapper';
import { getBikeSnakesForDisplayMap } from '../../src/display/map/dataReading';
import { mapActions } from '../../src/display/store/map.reducer';

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');

const ui = {
    isLoading: () => screen.getByText('Loading'),
};

describe('Map Display integration test', () => {
    it('Render the map display and have different snakes at different times', async () => {
        // given
        const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        const state = JSON.parse(buffer) as State;

        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
        (getData as Mock).mockResolvedValue({ data: state });
        const store = createDisplayStore();
        const loadingPage = act(() =>
            render(
                <MemoryRouter>
                    <RallyDisplayWrapper store={store} />
                </MemoryRouter>
            )
        );
        ui.isLoading();
        await loadingPage;

        screen.getAllByRole('button');
        const snakes = getBikeSnakesForDisplayMap(store.getState());
        expect(snakes).toHaveLength(1);
        expect(snakes[0].points).toHaveLength(1);
        expect(snakes[0].points[0]).toEqual({ lat: 48.141161, lng: 11.597148 });

        act(() => store.dispatch(mapActions.setCurrentTime(10000)));
        const snakes2 = getBikeSnakesForDisplayMap(store.getState());
        expect(snakes2[0].points).toHaveLength(3);
        expect(snakes2[0].points[0]).not.toEqual({ lat: 48.141161, lng: 11.597148 });
    });
});
