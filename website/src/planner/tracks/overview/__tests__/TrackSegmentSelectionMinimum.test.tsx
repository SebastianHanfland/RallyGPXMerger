import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SEGMENT, State, TrackSegment } from '../../../store/types.ts';
import { TrackSegmentSelectionMinimum } from '../TrackSegmentSelectionMinimum.tsx';

const useSelector = vi.hoisted(() => vi.fn());
const useDispatch = vi.hoisted(() => vi.fn());
const simpleElementDisplay = vi.hoisted(() => vi.fn(() => <div />));

vi.mock('react-redux', () => ({ useSelector, useDispatch }));
vi.mock('react-sortablejs', () => ({
    ReactSortable: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock('../SimpleElementDisplay.tsx', () => ({ SimpleElementDisplay: simpleElementDisplay }));

describe('TrackSegmentSelectionMinimum', () => {
    beforeEach(() => {
        useSelector.mockImplementation((selector: (state: State) => unknown) =>
            selector({ segmentData: { segments: [] } } as unknown as State)
        );
        useDispatch.mockReturnValue(vi.fn());
        simpleElementDisplay.mockClear();
    });

    it('uses the manually assigned color of the parsed segment', () => {
        const trackSegment: TrackSegment = { id: 'segment-id', segmentId: 'segment-id', type: SEGMENT };
        useSelector.mockReturnValue([{ id: 'segment-id', filename: 'route.gpx', color: '#123456', points: [] }]);

        render(<TrackSegmentSelectionMinimum track={{ id: 'track-id', name: 'Track', segments: [trackSegment] }} />);

        expect(simpleElementDisplay).toHaveBeenCalledWith(
            {
                trackElement: { ...trackSegment, color: '#123456' },
                trackId: 'track-id',
            },
            undefined
        );
    });

    it('uses the generated segment color when no manual color is assigned', () => {
        const trackSegment: TrackSegment = { id: 'segment-id', segmentId: 'segment-id', type: SEGMENT };
        useSelector.mockReturnValue([{ id: 'segment-id', filename: 'route.gpx', points: [] }]);

        render(<TrackSegmentSelectionMinimum track={{ id: 'track-id', name: 'Track', segments: [trackSegment] }} />);

        expect(simpleElementDisplay).toHaveBeenCalledWith(
            {
                trackElement: { ...trackSegment, color: '#segmen' },
                trackId: 'track-id',
            },
            undefined
        );
    });
});
