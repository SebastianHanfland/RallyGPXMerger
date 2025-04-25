import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { expect, Mock, vi } from 'vitest';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { getLanguage } from '../../src/language';
import { getData } from '../../src/api/api';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';
import { createVersionsStore } from '../../src/versions/store/store';
import { RallyDisplayWrapper } from '../../src/versions/RallyDisplayWrapper';
import { getZipCurrentMarkerPositionsForTracks } from '../../src/versions/map/dataReading';

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');

const ui = {
    isLoading: () => screen.getByText('Loading'),
};

describe('Table integration test', () => {
    it('Render a table and ensure the presence of fields', async () => {
        // given
        const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        const state = JSON.parse(buffer) as State;

        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
        (getData as Mock).mockResolvedValue({ data: state });
        const store = createVersionsStore();
        const loadingPage = act(() =>
            render(
                <BrowserRouter>
                    <RallyDisplayWrapper store={store} />
                </BrowserRouter>
            )
        );
        ui.isLoading();
        await loadingPage;

        screen.getAllByRole('button');
        const displayedTracks = getZipCurrentMarkerPositionsForTracks(store.getState());
        expect(displayedTracks).toHaveLength(1);
    });
});
