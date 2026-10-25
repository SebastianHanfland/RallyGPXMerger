import { screen, within } from '@testing-library/react';
import { getMessages } from '../../../src/lang/getMessages';

const messages = getMessages('en');

export const flowOverviewUi = {
    openButton: () => screen.getByRole('button', { name: messages['msg.flowOverview'] }),
    dialog: () => screen.getByRole('dialog'),
    title: () => within(screen.getByRole('dialog')).getByText(messages['msg.flowOverview.title']),
    graph: () => within(screen.getByRole('dialog')).getByTestId('flow-overview-graph'),
    node: () => within(screen.getByRole('dialog')).getAllByTestId('flow-overview-node'),
    finish: () => within(screen.getByRole('dialog')).getByTestId('flow-overview-finish'),
    legend: () => within(screen.getByRole('dialog')).getByTestId('flow-overview-legend'),
    closeButton: () => {
        const buttons = within(screen.getByRole('dialog')).getAllByRole('button', { name: messages['msg.close'] });
        return buttons[buttons.length - 1]!;
    },
};
