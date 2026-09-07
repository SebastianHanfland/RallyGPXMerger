import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FileDownloader, FileDownloaderDropdownItem } from '../FileDownloader.tsx';

const saveAs = vi.hoisted(() => vi.fn());

vi.mock('file-saver', () => ({ default: { saveAs } }));

const messages = {
    'msg.downloadFile.hint': 'Download {name}',
    'msg.downloadFile': 'Download file',
};

function renderWithIntl(element: ReactElement) {
    return render(
        <IntlProvider locale="en" messages={messages}>
            {element}
        </IntlProvider>
    );
}

describe('GPX file download controls', () => {
    beforeEach(() => {
        saveAs.mockClear();
    });

    it('evaluates FileDownloader content only after clicking', () => {
        const getContent = vi.fn(() => 'gpx-content');

        renderWithIntl(<FileDownloader id="track-1" name="track.gpx" content={getContent} />);

        expect(getContent).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'track.gpx' }));

        expect(getContent).toHaveBeenCalledTimes(1);
        expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'track.gpx');
    });

    it('evaluates FileDownloaderDropdownItem content only after clicking', () => {
        const getContent = vi.fn(() => 'gpx-content');

        renderWithIntl(<FileDownloaderDropdownItem name="segment.gpx" content={getContent} />);

        expect(getContent).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: /download file/i }));

        expect(getContent).toHaveBeenCalledTimes(1);
        expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'segment.gpx');
    });
});
