import { screen } from '@testing-library/react';
import { getMessages } from '../../../src/lang/getMessages';

const messages = getMessages('en');

export const mapDisplayUi = {
    loading: () => screen.getByText('Loading'),
    trackInfoButton: () => screen.getAllByRole('button', { name: messages['msg.trackInfoShort'] })[0]!,
    pdfDownloadButtons: () => screen.getAllByRole('button', { name: /PDF/ }),
    gpxDownloadButtons: () => screen.getAllByRole('button', { name: /GPX/ }),
};
