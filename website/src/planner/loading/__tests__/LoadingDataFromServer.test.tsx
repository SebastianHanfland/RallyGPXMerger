import { act, render, screen, waitFor } from '@testing-library/react';
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
import { backendActions } from '../../store/backend.reducer.ts';
import { getData } from '../../../api/api.ts';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { segmentDataActions } from '../../store/segmentData.redux.ts';

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
vi.mock('../../src/planner/store/storage', () => ({
    storage: {
        load: () => undefined,
        save: () => {},
    },
}));

describe('Import planning', () => {
    const ui = {
        showsModal: () => screen.getByRole('dialog'),
        differentIdText: () => {
            screen.getByText(messages['msg.differentPlannnings']);
            screen.getByText(messages['msg.differentPlannnings.details']);
        },
        differentStateText: () => {
            screen.getByText(messages['msg.localDataFound']);
            screen.getByText(messages['msg.localDataFound.details']);
        },
        confirmButton: () => screen.getByRole('button', { name: messages['msg.confirm'] }),
        abortButton: () => screen.getByRole('button', { name: messages['msg.close'] }),
    };

    describe('test block', () => {
        const testCases = [
            {
                description: 'should provide modal, when planning ids are different',
                urlPlanningId: '1234',
                storagePlanningId: '4321',
                isStateTheSame: false,
                expectShowModal: true,
            },
        ];

        testCases.forEach((testCase) =>
            it(testCase.description, async () => {
                const user = userEvent.setup();

                (getLanguage as Mock).mockImplementation(() => 'en');
                (useGetUrlParam as Mock).mockImplementation(() => testCase.urlPlanningId);
                (getData as Mock).mockResolvedValue({
                    trackMerge: { trackCompositions: [] },
                    segmentData: { segments: [{ id: '123', filename: '1', points: [] }] },
                });
                const store = createPlanningStore();
                if (testCase.storagePlanningId) {
                    store.dispatch(backendActions.setPlanningId(testCase.storagePlanningId));
                }
                store.dispatch(trackMergeActions.setTracks([]));
                store.dispatch(segmentDataActions.addGpxSegments([{ id: '123', filename: '1', points: [] }]));

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

                await waitFor(() => expect(ui.showsModal()).toBeDefined());
                ui.differentIdText();
                await user.click(ui.confirmButton());
                expect(getData).toHaveBeenCalledTimes(2);
                expect(getData).toHaveBeenCalledWith(testCase.urlPlanningId);
            })
        );
    });
});
