import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPlanningStore } from '../../store/planningStore.ts';
import { segmentDataActions } from '../../store/segmentData.redux.ts';
import { getGpxContentStringFromParsedSegment } from '../../../utils/SimpleGPXFromPoints.ts';
import { downloadFile } from '../../download/FileDownloader.tsx';
import { SegmentDownloadDropdownItem } from '../SegmentDownloadDropdownItem.tsx';
import { getMessages } from '../../../lang/getMessages.ts';

vi.mock('../../../utils/SimpleGPXFromPoints.ts', () => ({
    getGpxContentStringFromParsedSegment: vi.fn(() => 'gpx-content'),
}));

vi.mock('../../download/FileDownloader.tsx', async () => {
    const actual = await vi.importActual<typeof import('../../download/FileDownloader.tsx')>(
        '../../download/FileDownloader.tsx'
    );
    return { ...actual, downloadFile: vi.fn() };
});

describe('SegmentDownloadDropdownItem', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('creates GPX content only when download is clicked', () => {
        const store = createPlanningStore();
        store.dispatch(segmentDataActions.addGpxSegments([{ id: 'a', filename: 'a.gpx', points: [] }]));

        render(
            <Provider store={store}>
                <IntlProvider locale="en" messages={getMessages('en')}>
                    <SegmentDownloadDropdownItem id="a" name="a.gpx" />
                </IntlProvider>
            </Provider>
        );

        expect(getGpxContentStringFromParsedSegment).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: /download file/i }));

        expect(getGpxContentStringFromParsedSegment).toHaveBeenCalledTimes(1);
        expect(downloadFile).toHaveBeenCalledWith('a.gpx', 'gpx-content');
    });
});
