import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { RallyTableWrapper } from '../../src/display/RallyTableWrapper';
import { Mock, vi } from 'vitest';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { getLanguage } from '../../src/language';
import { getData } from '../../src/api/api';
import * as fs from 'node:fs';
import { State } from '../../src/planner/store/types';
import { createDisplayStore } from '../../src/display/store/store';
import { migrateVersion1To2 } from '../../src/migrate/migrateVersion1To2';
import { StateOld } from '../../src/planner/store/typesOld';

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');

const ui = {
    isLoading: () => screen.getByText('Loading'),
    hasHeading: () => screen.getByText('Ride of Silence 2024'),
    hasOneGpxDownloadButton: () => screen.getByRole('button', { name: /GPX/ }),
    hasOnePdfDownloadButton: () => screen.getByRole('button', { name: /PDF/ }),
    hasATable: () => {
        screen.getByRole('table');
        ['Name', 'Start', 'Ziel', 'Länge in km', 'Dateien'].forEach((text) =>
            screen.getByRole('columnheader', { name: text })
        );
        expect(screen.getAllByRole('row')).toHaveLength(2);
    },
};

describe('Table integration test', () => {
    it('Render a table and ensure the presence of fields', async () => {
        // given
        const buffer = '' + fs.readFileSync('./public/RideOfSilence2024.json');
        const state = JSON.parse(buffer) as StateOld;

        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
        (getData as Mock).mockResolvedValue(migrateVersion1To2(state));
        const store = createDisplayStore();
        const loadingPage = act(() =>
            render(
                <MemoryRouter>
                    <RallyTableWrapper store={store} />
                </MemoryRouter>
            )
        );
        ui.isLoading();
        await loadingPage;

        ui.hasHeading();

        ui.hasATable();
        ui.hasOneGpxDownloadButton();
        ui.hasOnePdfDownloadButton();
    });
});
