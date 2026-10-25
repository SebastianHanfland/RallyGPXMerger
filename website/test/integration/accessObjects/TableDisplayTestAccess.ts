import { screen } from '@testing-library/react';

export const tableDisplayUi = {
    loading: () => screen.getByText('Loading'),
    heading: () => screen.getByText('Ride of Silence 2024'),
    tables: () => screen.getAllByRole('table'),
    table: () => screen.getByRole('table'),
    gpxDownloadButtons: () => screen.getAllByRole('button', { name: /GPX/ }),
    pdfDownloadButtons: () => screen.getAllByRole('button', { name: /PDF/ }),
    columnHeader: (name: string) => screen.getByRole('columnheader', { name }),
    text: (value: string) => screen.getByText(value),
};
