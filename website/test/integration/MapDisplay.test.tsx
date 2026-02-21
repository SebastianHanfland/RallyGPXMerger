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
import { displayMapActions } from '../../src/display/store/displayMapReducer';
import { getMessages } from '../../src/lang/getMessages';
import userEvent from '@testing-library/user-event';
import { migrateVersion1To2 } from '../../src/migrate/migrateVersion1To2';
import { StateOld } from '../../src/planner/store/typesOld';

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('leaflet.locatecontrol', () => ({
    LocateControl: () => ({
        locate: () => {},
    }),
}));

const messages = getMessages('en');

const ui = {
    isLoading: () => screen.getByText('Loading'),
    trackInfoButton: () => screen.getAllByRole('button', { name: messages['msg.trackInfoShort'] })[0],
    pdfDownloadButtons: () => screen.getAllByRole('button', { name: /PDF/ }),
    gpxDownloadButtons: () => screen.getAllByRole('button', { name: /GPX/ }),
};

describe('Map Display integration test', () => {
    it('Render the map display and have different snakes at different times', async () => {
        // given
        const buffer = '' + fs.readFileSync('./test/integration/data/RideOfSilence2024.json');
        const state = JSON.parse(buffer) as StateOld;
        const user = userEvent.setup();

        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
        (getData as Mock).mockResolvedValue(migrateVersion1To2(state));
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

        act(() => store.dispatch(displayMapActions.setCurrentTime(10000)));
        const snakes2 = getBikeSnakesForDisplayMap(store.getState());
        expect(snakes2[0].points).toHaveLength(3);
        expect(snakes2[0].points[0]).not.toEqual({ lat: 48.141161, lng: 11.597148 });

        await user.click(ui.trackInfoButton());
        ui.pdfDownloadButtons();
        ui.gpxDownloadButtons();
    });
});
