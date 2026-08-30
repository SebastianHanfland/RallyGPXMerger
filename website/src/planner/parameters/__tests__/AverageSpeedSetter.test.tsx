import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { AverageSpeedNumberInput } from '../AverageSpeedSetter.tsx';
import { createPlanningStore } from '../../store/planningStore.ts';
import { getMessages } from '../../../lang/getMessages.ts';
import { getParsedGpxSegments, segmentDataActions } from '../../store/segmentData.redux.ts';
import { getAverageSpeedInKmH, getForcedAverageSpeed } from '../../store/settings.reducer.ts';
import { ParsedGpxSegment, ParsedPoint } from '../../store/types.ts';
import { generateParsedPointsWithConstantSpeedInSeconds } from '../../../common/calculation/speed/generateParsedPointsWithConstantSpeedInSeconds.ts';
import { generateParsedPointsWithTimeInSeconds } from '../../../common/calculation/speed/speedSimulatorTimeInSeconds.ts';

const messages = getMessages('en');

const hillyPoints: ParsedPoint[] = [
    { l: 11.0, b: 48.0, e: 0, s: -1, t: 0 },
    { l: 11.0135, b: 48.0, e: 200, s: -1, t: 0 },
];

const segment: ParsedGpxSegment = {
    id: 'segment-1',
    filename: 'segment1',
    points: hillyPoints,
};

function lastTime(points: ParsedPoint[]): number {
    return points[points.length - 1].t;
}

function renderAverageSpeedInput() {
    const store = createPlanningStore();
    store.dispatch(segmentDataActions.addGpxSegments([segment]));
    render(
        <Provider store={store}>
            <IntlProvider locale="en" messages={messages}>
                <AverageSpeedNumberInput />
            </IntlProvider>
        </Provider>
    );
    return store;
}

describe('AverageSpeedNumberInput', () => {
    it('stores a forced default speed and applies constant timing', async () => {
        const store = renderAverageSpeedInput();
        const user = userEvent.setup();
        const input = screen.getByTitle(messages['msg.averageSpeed.hint']);

        await user.clear(input);
        await user.type(input, '12!');

        await waitFor(() => {
            expect(getAverageSpeedInKmH(store.getState())).toBe(12);
            expect(getForcedAverageSpeed(store.getState())).toBe(true);
        });
        await waitFor(() => {
            expect(lastTime(getParsedGpxSegments(store.getState())[0].points)).toEqual(
                lastTime(generateParsedPointsWithConstantSpeedInSeconds(12, hillyPoints))
            );
        });
        expect(lastTime(getParsedGpxSegments(store.getState())[0].points)).not.toEqual(
            lastTime(generateParsedPointsWithTimeInSeconds(12, hillyPoints))
        );
    });

    it('keeps terrain-adjusted default speed without a force marker', async () => {
        const store = renderAverageSpeedInput();
        const user = userEvent.setup();
        const input = screen.getByTitle(messages['msg.averageSpeed.hint']);

        await user.clear(input);
        await user.type(input, '12');

        await waitFor(() => {
            expect(getForcedAverageSpeed(store.getState())).toBe(false);
            expect(lastTime(getParsedGpxSegments(store.getState())[0].points)).toEqual(
                lastTime(generateParsedPointsWithTimeInSeconds(12, hillyPoints))
            );
        });
    });
});
