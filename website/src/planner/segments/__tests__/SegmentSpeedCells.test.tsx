import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { SegmentSpeedCells } from '../SegmentSpeedCells.tsx';
import { createPlanningStore } from '../../store/planningStore.ts';
import { getMessages } from '../../../lang/getMessages.ts';
import {
    getForcedSegmentSpeeds,
    getParsedGpxSegments,
    getSegmentSpeeds,
    segmentDataActions,
} from '../../store/segmentData.redux.ts';
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

function renderWithStore() {
    const store = createPlanningStore();
    store.dispatch(segmentDataActions.addGpxSegments([segment]));
    render(
        <Provider store={store}>
            <IntlProvider locale="en" messages={messages}>
                <table>
                    <tbody>
                        <tr>
                            <SegmentSpeedCells gpxSegment={segment} />
                        </tr>
                    </tbody>
                </table>
            </IntlProvider>
        </Provider>
    );
    return store;
}

describe('SegmentSpeedCells', () => {
    it.each(['20!', '!20'])('stores %s as a forced speed of 20', async (typedValue) => {
        const store = renderWithStore();
        const user = userEvent.setup();
        const input = screen.getByPlaceholderText(messages['msg.customSpeed.placeholder']);

        await user.type(input, typedValue);

        await waitFor(() => {
            expect(getSegmentSpeeds(store.getState())[segment.id]).toBe(20);
            expect(getForcedSegmentSpeeds(store.getState())[segment.id]).toBe(true);
        });
        expect(input).toHaveValue(typedValue);
    });

    it('stores a speed without a force marker as terrain-adjusted', async () => {
        const store = renderWithStore();
        const user = userEvent.setup();
        const input = screen.getByPlaceholderText(messages['msg.customSpeed.placeholder']);

        await user.type(input, '20');

        await waitFor(() => {
            expect(getSegmentSpeeds(store.getState())[segment.id]).toBe(20);
            expect(getForcedSegmentSpeeds(store.getState())[segment.id]).toBe(false);
        });
        const points = getParsedGpxSegments(store.getState())[0].points;
        expect(lastTime(points)).toEqual(lastTime(generateParsedPointsWithTimeInSeconds(20, hillyPoints)));
    });

    it('applies constant speed when a force marker is entered', async () => {
        const store = renderWithStore();
        const user = userEvent.setup();
        const input = screen.getByPlaceholderText(messages['msg.customSpeed.placeholder']);

        await user.type(input, '12!');

        await waitFor(() => {
            const points = getParsedGpxSegments(store.getState())[0].points;
            expect(lastTime(points)).toEqual(lastTime(generateParsedPointsWithConstantSpeedInSeconds(12, hillyPoints)));
        });
        expect(lastTime(getParsedGpxSegments(store.getState())[0].points)).not.toEqual(
            lastTime(generateParsedPointsWithTimeInSeconds(12, hillyPoints))
        );
    });

    it('shows a stored forced speed with a trailing force marker', () => {
        const store = createPlanningStore();
        store.dispatch(segmentDataActions.addGpxSegments([segment]));
        store.dispatch(
            segmentDataActions.setSegmentSpeeds({ id: segment.id, speed: 20, averageSpeed: 12, forced: true })
        );
        render(
            <Provider store={store}>
                <IntlProvider locale="en" messages={messages}>
                    <table>
                        <tbody>
                            <tr>
                                <SegmentSpeedCells gpxSegment={segment} />
                            </tr>
                        </tbody>
                    </table>
                </IntlProvider>
            </Provider>
        );

        expect(screen.getByPlaceholderText(messages['msg.customSpeed.placeholder'])).toHaveValue('20!');
    });
});
