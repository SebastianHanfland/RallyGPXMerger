import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { Provider } from 'react-redux';
import { GpxSegmentsUploadAndParse } from '../GpxSegmentsUploadAndParse.tsx';
import { getLanguage } from '../../../language.ts';
import { createPlanningStore } from '../../store/planningStore.ts';
import { plannerUi as ui } from '../../../../test/integration/data/PlannerTestAccess.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { IntlProvider } from 'react-intl';
import { getMessages } from '../../../lang/getMessages.ts';

vi.mock('../../../language');
vi.mock('../../src/api/api');
vi.mock('../../logic/resolving/street-new/geoApifyMapMatching.ts', () => ({
    geoApifyFetchMapMatching: () => () => Promise.resolve({}),
}));
vi.mock('../../src/planner/logic/resolving/postcode/fetchPostCodeForCoordinate', () => ({
    fetchPostCodeForCoordinate: () => () => Promise.resolve({ postCode: '1234' }),
}));

describe('GpxUpload and parse', () => {
    it('Can upload a segment and points are available', async () => {
        (getLanguage as Mock).mockImplementation(() => 'en');
        const store = createPlanningStore();
        render(
            <Provider store={store}>
                <IntlProvider locale={'en'} messages={getMessages('en')}>
                    <GpxSegmentsUploadAndParse />
                </IntlProvider>
            </Provider>,
            { wrapper: MemoryRouter }
        );

        await ui.uploadGpxSegment('segment1');

        console.log({ seg1: getParsedGpxSegments(store.getState()) });
        await waitFor(() => expect(getParsedGpxSegments(store.getState())).toHaveLength(1), { timeout: 2000 });
        const points = getParsedGpxSegments(store.getState())[0].points;
        console.log({ points, seg: getParsedGpxSegments(store.getState()) });
        await waitFor(() => expect(getParsedGpxSegments(store.getState())[0].points.length).toBeGreaterThan(1), {
            timeout: 2000,
        });
        expect(points.length).toBeGreaterThan(10);
        expect(points[points.length - 1].t).toBeGreaterThan(200);
    });
});
