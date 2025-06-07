import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { Provider } from 'react-redux';
import { GpxSegmentsUploadAndParse } from '../GpxSegmentsUploadAndParse.tsx';
import { getLanguage } from '../../../language.ts';
import { createPlanningStore } from '../../store/planningStore.ts';
import { plannerUi as ui } from '../../../../test/integration/data/PlannerTestAccess.ts';
import { getParsedGpxSegments } from '../../new-store/segmentData.redux.ts';
import { IntlProvider } from 'react-intl';
import { getMessages } from '../../../lang/getMessages.ts';

vi.mock('../../../language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');
vi.mock('../../src/planner/logic/resolving/streets/mapMatchingStreetResolver');
vi.mock('../../src/planner/logic/resolving/postcode/postCodeResolver', () => ({
    addPostCodeToStreetInfos: () => Promise.resolve(),
}));

describe('GpxUpload and parse', () => {
    it('Starts a new simple planning', async () => {
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

        ui.uploadGpxSegment('segment1');
        const segments = getParsedGpxSegments(store.getState());
        expect(segments).toHaveLength(0);
    });
});
