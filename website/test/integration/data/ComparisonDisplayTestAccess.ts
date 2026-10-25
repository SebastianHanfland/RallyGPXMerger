import { screen } from '@testing-library/react';

export const comparisonDisplayUi = {
    loading: () => screen.getByText('Loading'),
};
