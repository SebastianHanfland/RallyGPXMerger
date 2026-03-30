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
import { isStateTheSame } from '../IsStateTheSame.ts';

const messages = getMessages('en');

vi.mock('../IsStateTheSame');
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
        showsNoModal: () => expect(screen.queryByRole('dialog')).toBeNull(),
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

    describe('test loading and asking for what to load', () => {
        const testCases = [
            {
                description: 'should provide modal, when planning ids are different, and then load on confirm',
                urlPlanningId: '1234',
                storagePlanningId: '4321',
                isStateTheSame: false,
                isLocalStatePresent: true,
                expectShowModal: 'different',
                action: 'confirm',
                numberOfExpectedGetDataCalls: 2,
            },
            {
                description: 'should provide modal, when planning ids are same but states are different',
                urlPlanningId: '1234',
                storagePlanningId: '1234',
                isStateTheSame: false,
                isLocalStatePresent: true,
                expectShowModal: 'same',
                action: 'confirm',
                numberOfExpectedGetDataCalls: 2,
            },
            {
                description: 'should not provide modal, when planning ids are same and states are same',
                urlPlanningId: '1234',
                storagePlanningId: '1234',
                isStateTheSame: true,
                isLocalStatePresent: true,
                expectShowModal: false,
                action: undefined,
                numberOfExpectedGetDataCalls: 1,
            },

            {
                description: 'should not provide modal, when no local data is stored',
                urlPlanningId: '1234',
                storagePlanningId: undefined,
                isStateTheSame: true,
                isLocalStatePresent: false,
                expectShowModal: false,
                action: undefined,
                numberOfExpectedGetDataCalls: 2,
            },
            {
                description: 'should not provide modal, when no local data is stored',
                urlPlanningId: '1234',
                storagePlanningId: undefined,
                isStateTheSame: true,
                isLocalStatePresent: false,
                expectShowModal: false,
                action: undefined,
                numberOfExpectedGetDataCalls: 2,
            },
            {
                description: 'should not provide modal, when no url planning id is present',
                urlPlanningId: undefined,
                storagePlanningId: undefined,
                isStateTheSame: true,
                isLocalStatePresent: false,
                expectShowModal: false,
                action: undefined,
                numberOfExpectedGetDataCalls: 0,
            },
            {
                description: 'should not provide modal, when no url planning id is present',
                urlPlanningId: undefined,
                storagePlanningId: undefined,
                isStateTheSame: false,
                isLocalStatePresent: false,
                expectShowModal: false,
                action: undefined,
                numberOfExpectedGetDataCalls: 0,
            },
        ];

        testCases.forEach((testCase) =>
            it(testCase.description, async () => {
                const user = userEvent.setup();

                (getLanguage as Mock).mockImplementation(() => 'en');
                (isStateTheSame as Mock).mockImplementation(() => testCase.isStateTheSame);
                (useGetUrlParam as Mock).mockImplementation(() => testCase.urlPlanningId);
                (getData as Mock).mockResolvedValue({
                    trackMerge: { trackCompositions: [] },
                    segmentData: { segments: [{ id: '123', filename: '1', points: [] }] },
                });
                vi.clearAllMocks();

                const store = createPlanningStore();
                if (testCase.storagePlanningId) {
                    store.dispatch(backendActions.setPlanningId(testCase.storagePlanningId));
                }
                if (testCase.isLocalStatePresent) {
                    store.dispatch(trackMergeActions.setTracks([]));
                    store.dispatch(segmentDataActions.addGpxSegments([{ id: '123', filename: '1', points: [] }]));
                }

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

                if (testCase.expectShowModal === false) {
                    await waitFor(() => ui.showsNoModal());
                } else {
                    if (testCase.expectShowModal === 'same') {
                        await waitFor(() => expect(ui.showsModal()).toBeDefined());
                        ui.differentStateText();
                    }
                    if (testCase.expectShowModal === 'different') {
                        await waitFor(() => expect(ui.showsModal()).toBeDefined());
                        ui.differentIdText();
                    }

                    if (testCase.action === 'confirm') {
                        await user.click(ui.confirmButton());
                    } else if (testCase.action === 'confirm') {
                        await user.click(ui.abortButton());
                    }
                }

                expect(getData).toHaveBeenCalledTimes(testCase.numberOfExpectedGetDataCalls);
                if (testCase.numberOfExpectedGetDataCalls > 0) {
                    expect(getData).toHaveBeenCalledWith(testCase.urlPlanningId);
                }
            })
        );
    });
});
