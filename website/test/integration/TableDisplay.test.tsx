import { act, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import * as fs from 'node:fs';
import { useGetUrlParam } from '../../src/utils/linkUtil';
import { getLanguage } from '../../src/language';
import { getData } from '../../src/api/api';
import { RallyTableWrapper } from '../../src/display/RallyTableWrapper';
import { createDisplayStore } from '../../src/display/store/store';
import { migrateVersion1To2 } from '../../src/migrate/migrateVersion1To2';
import { StateOld } from '../../src/planner/store/typesOld';
import { tableDisplayUi } from './accessObjects/TableDisplayTestAccess.ts';

vi.mock('../../src/utils/linkUtil');
vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');
vi.mock('@react-pdf/renderer', () => ({ StyleSheet: { create: () => {} } }));

async function renderTable(vertical = false, mutate?: (state: ReturnType<typeof migrateVersion1To2>) => void) {
    const state = JSON.parse('' + fs.readFileSync('./test/integration/data/RideOfSilence2024.json')) as StateOld;
    const migratedState = migrateVersion1To2(state);
    mutate?.(migratedState);
    (getLanguage as Mock).mockImplementation(() => 'en');
    (useGetUrlParam as Mock).mockImplementation(() => 'planning-id');
    (getData as Mock).mockResolvedValue(migratedState);
    const store = createDisplayStore();
    act(() => {
        render(
            <MemoryRouter>
                <RallyTableWrapper store={store} vertical={vertical} />
            </MemoryRouter>
        );
    });
    tableDisplayUi.loading();
    await waitFor(() => expect(tableDisplayUi.heading()).toBeVisible());
    return store;
}

describe('table display integration', () => {
    it('renders the planning heading and table columns', async () => {
        await renderTable();

        expect(tableDisplayUi.heading()).toBeVisible();
        expect(tableDisplayUi.tables()).toHaveLength(1);
        expect(tableDisplayUi.columnHeader('Track')).toBeInTheDocument();
        expect(tableDisplayUi.columnHeader('Start')).toBeInTheDocument();
        expect(tableDisplayUi.table().querySelectorAll('tbody tr')).toHaveLength(1);
    });

    it('offers one GPX and one PDF download for the standard table', async () => {
        await renderTable();

        expect(tableDisplayUi.gpxDownloadButtons()).toHaveLength(1);
        expect(tableDisplayUi.pdfDownloadButtons()).toHaveLength(1);
    });

    it('renders entry points in the vertical table layout', async () => {
        await renderTable(true, (state) => {
            state.trackMerge.trackCompositions[0]!.segments.push(
                { id: 'entry-point-1', type: 'ENTRY', streetName: 'Entry Point 1' },
                { id: 'entry-point-2', type: 'ENTRY', streetName: 'Entry Point 2' }
            );
        });

        const table = tableDisplayUi.table();
        expect(table).toHaveStyle({ width: '100%', tableLayout: 'fixed' });
        expect(table.querySelectorAll('col')[0]).toHaveStyle({ width: 'auto' });
        expect(table.querySelectorAll('col')[1]).toHaveStyle({ width: '180px' });
        expect(table.querySelectorAll('col')[2]).toHaveStyle({ width: '180px' });
        expect(tableDisplayUi.columnHeader('Location')).toHaveStyle({ textAlign: 'left' });
        expect(tableDisplayUi.text('Entry Point 1').closest('td')).toHaveStyle({ textAlign: 'left' });
        expect(table.querySelectorAll('tbody tr')).toHaveLength(3);
        expect(tableDisplayUi.text('Entry Point 2')).toBeVisible();
    });
});
