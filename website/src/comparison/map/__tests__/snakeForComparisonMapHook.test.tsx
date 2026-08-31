import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RefObject } from 'react';
import { vi } from 'vitest';
import { snakeForComparisonMapHook } from '../snakeForComparisonMapHook.ts';

const { addBikeSnakesToLayer } = vi.hoisted(() => ({ addBikeSnakesToLayer: vi.fn() }));
vi.mock('../../../common/map/addSnakeWithBikeToMap.ts', () => ({ addBikeSnakesToLayer }));
vi.mock('../dataReading.ts', () => ({
    getBikeSnakesForComparisonMap: (state: { points: unknown[] }) => state.points,
    getCurrentComparisonTimeStamps: () => ({}),
}));

describe('snakeForComparisonMapHook', () => {
    it('redraws when the derived points change', async () => {
        const store = configureStore({
            reducer: (state = { points: [], tracks: {}, map: {} }, action: { type: string; payload?: unknown }) =>
                action.type === 'setPoints' ? { ...state, points: action.payload } : state,
        });
        const snakeLayer = { current: null } as RefObject<null>;

        renderHook(() => snakeForComparisonMapHook(snakeLayer), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
        });
        expect(addBikeSnakesToLayer).toHaveBeenCalledTimes(1);

        store.dispatch({ type: 'setPoints', payload: [{ id: 'new-point' }] });
        await waitFor(() => expect(addBikeSnakesToLayer).toHaveBeenCalledTimes(2));
    });
});
