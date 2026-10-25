import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPlanningStore } from '../../store/planningStore';
import { segmentDataActions } from '../../store/segmentData.redux';
import { getGpxContentStringFromParsedSegment } from '../../../utils/SimpleGPXFromPoints';
import { downloadFile } from '../../download/FileDownloader';
import { SegmentDownloadDropdownItem } from '../SegmentDownloadDropdownItem';
import { getMessages } from '../../../lang/getMessages';

vi.mock('../../../utils/SimpleGPXFromPoints', () => ({
    getGpxContentStringFromParsedSegment: vi.fn(() => 'gpx-content'),
}));

vi.mock('../../download/FileDownloader', async () => {
    const actual = await vi.importActual<typeof import('../../download/FileDownloader')>(
        '../../download/FileDownloader'
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
