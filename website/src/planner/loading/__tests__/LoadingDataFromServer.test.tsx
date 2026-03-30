import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Mock, vi } from 'vitest';
import { Provider } from 'react-redux';
import { LoadingDataFromServerModal } from '../LoadingDataFromServerModal.tsx';
import { getMessages } from '../../../lang/getMessages.ts';
import { getLanguage } from '../../../language.ts';
import { useGetUrlParam } from '../../../utils/linkUtil.ts';
import { createPlanningStore } from '../../store/planningStore.ts';
import { IntlProvider } from 'react-intl';

const messages = getMessages('en');

vi.mock('../../../language');
vi.mock('../../../api/api');
vi.mock('../../../utils/linkUtil');
vi.mock('../../../planner/logic/resolving/street-new/geoApifyMapMatching', () => ({
    geoApifyFetchMapMatching: () => () => Promise.resolve({}),
}));
vi.mock('../../src/planner/logic/resolving/postcode/fetchPostCodeForCoordinate', () => ({
    fetchPostCodeForCoordinate: () => () => Promise.resolve({ postCode: '1234' }),
}));

describe('Import planning', () => {
    it('import a simple planning and check that everything is properly set', async () => {
        const user = userEvent.setup();

        (getLanguage as Mock).mockImplementation(() => 'en');
        (useGetUrlParam as Mock).mockImplementation(() => undefined);
        const store = createPlanningStore();

        act(() =>
            render(
                <MemoryRouter>
                    <IntlProvider locale={'en'} messages={messages}>
                        <Provider store={store}>
                            <LoadingDataFromServerModal />
                        </Provider>
                    </IntlProvider>
                </MemoryRouter>
            )
        );
    });
});
