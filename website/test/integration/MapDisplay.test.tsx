import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import * as fs from 'node:fs';
import { getData } from '../../src/api/api';
import { getLanguage } from '../../src/language';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { RallyDisplayWrapper } from '../../src/display/RallyDisplayWrapper';
import { createDisplayStore } from '../../src/display/store/store';
import { getBikeSnakesForDisplayMap } from '../../src/display/map/dataReading';
import { displayMapActions } from '../../src/display/store/displayMapReducer';
import { migrateVersion1To2 } from '../../src/migrate/migrateVersion1To2';
import { StateOld } from '../../src/planner/store/typesOld';
import { mapDisplayUi } from './accessObjects/MapDisplayTestAccess';

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('leaflet.locatecontrol', () => ({ LocateControl: () => ({ locate: () => {} }) }));
vi.mock('@react-pdf/renderer', () => ({ StyleSheet: { create: () => {} } }));

async function renderMapDisplay() {
    const state = JSON.parse('' + fs.readFileSync('./test/integration/data/RideOfSilence2024.json')) as StateOld;
    (getLanguage as Mock).mockImplementation(() => 'en');
    (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
    (getData as Mock).mockResolvedValue(migrateVersion1To2(state));
    const store = createDisplayStore();
    act(() => {
        render(
            <MemoryRouter>
                <RallyDisplayWrapper store={store} />
            </MemoryRouter>
        );
    });
    mapDisplayUi.loading();
    await waitFor(() => expect(getBikeSnakesForDisplayMap(store.getState())).toHaveLength(1));
    return store;
}

describe('map display integration', () => {
    it('renders the initial bike position', async () => {
        const store = await renderMapDisplay();
        const snakes = getBikeSnakesForDisplayMap(store.getState());

        expect(snakes[0]!.points).toHaveLength(1);
        expect(snakes[0]!.points[0]).toEqual({ lat: 48.141161, lng: 11.597148 });
    });

    it('updates the bike path when simulation time changes', async () => {
        const store = await renderMapDisplay();
        act(() => store.dispatch(displayMapActions.setCurrentTime(10000)));

        const snakes = getBikeSnakesForDisplayMap(store.getState());
        expect(snakes[0]!.points).toHaveLength(3);
        expect(snakes[0]!.points[0]).not.toEqual({ lat: 48.141161, lng: 11.597148 });
    });

    it('opens track information with GPX and PDF downloads', async () => {
        await renderMapDisplay();
        const user = userEvent.setup();

        await user.click(mapDisplayUi.trackInfoButton());
        expect(mapDisplayUi.pdfDownloadButtons()).toHaveLength(2);
        expect(mapDisplayUi.gpxDownloadButtons()).toHaveLength(2);
    });
});
