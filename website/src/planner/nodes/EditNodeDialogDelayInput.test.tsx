import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { describe, expect, it, vi } from 'vitest';
import { EditNodeDialogDelayInput } from './EditNodeDialogDelayInput.tsx';
import { NodeSpecification } from '../store/types.ts';

const messages = {
    'msg.nodeOffsetPercentage': 'Node offset percentage',
    'msg.nodeOffsetCalculated': 'Calculated offset: {people} people',
};

describe('EditNodeDialogDelayInput', () => {
    it('stores the percentage and its calculated participant offset', () => {
        const setNodeSpecs = vi.fn<(nodeSpecs: NodeSpecification) => void>();
        const nodeSpecs: NodeSpecification = {
            totalCount: 300,
            trackOffsets: { A1: 0 },
        };

        render(
            <IntlProvider locale="en" messages={messages}>
                <EditNodeDialogDelayInput
                    nodeSpecs={nodeSpecs}
                    setNodeSpecs={setNodeSpecs}
                    branchSize={100}
                    segmentId="A1"
                    total={300}
                    peopleOffset={100}
                    percentage={50}
                />
            </IntlProvider>
        );

        fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '60' } });

        expect(setNodeSpecs).toHaveBeenCalledWith({
            totalCount: 300,
            trackOffsets: { A1: 120 },
            trackOffsetPercentages: { A1: 60 },
        });
        expect(screen.getByText('Calculated offset: 100 people')).toBeInTheDocument();
    });
});
