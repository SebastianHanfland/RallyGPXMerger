import { Mock, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { getLanguage } from '../../src/language';
import { plannerUi } from './accessObjects/PlannerTestAccess';
import { renderPlanner, startComplexPlanning, startSimplePlanning } from './data/PlannerTestSetup';

vi.mock('../../src/language');
vi.mock('../../src/api/api');
vi.mock('../../src/versions/cache/readableTracks');
vi.mock('../../src/planner/logic/resolving/postcode/fetchPostCodeForCoordinate', () => ({
    fetchPostCodeForCoordinate: () => () => Promise.resolve({ postCode: '1234' }),
}));
vi.mock('../../src/planner/logic/resolving/streets/geoApifyMapMatching', () => ({
    geoApifyFetchMapMatching: () => () => Promise.resolve({}),
}));
vi.mock('@react-pdf/renderer', () => ({ StyleSheet: { create: () => {} } }));

describe('planner navigation', () => {
    beforeEach(() => {
        (getLanguage as Mock).mockImplementation(() => 'en');
    });

    it('starts a new simple planning', async () => {
        const { user } = renderPlanner();

        expect(plannerUi.header()).toBeInTheDocument();
        await startSimplePlanning(user);

        expect(plannerUi.cloudActionsButton()).toHaveStyle({ width: '45px', height: '45px' });
        expect(plannerUi.downloadsButton()).toHaveStyle({ width: '45px', height: '45px' });
    });

    it('opens and closes the feedback dialog from the wizard start page', async () => {
        const { user } = renderPlanner();

        const feedbackButton = screen.getByRole('button', { name: 'Feedback / change request' });
        expect(within(feedbackButton).getByTestId('feedback-icon')).toBeInTheDocument();
        await user.click(feedbackButton);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveTextContent('Please register or sign in at GitHub');
        expect(within(dialog).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
            'href',
            'https://github.com/signup'
        );
        expect(within(dialog).getByRole('link', { name: 'Create a GitHub issue' })).toHaveAttribute(
            'href',
            'https://github.com/SebastianHanfland/RallyGPXMerger/issues/new'
        );

        const closeButtons = within(dialog).getAllByRole('button', { name: 'Close' });
        await user.click(closeButtons[closeButtons.length - 1]!);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('starts a new complex planning on the segments section', async () => {
        const { user } = renderPlanner();

        await startComplexPlanning(user);

        expect(plannerUi.complexSegmentsTab()).toBeInTheDocument();
        expect(plannerUi.overviewButton()).toBeInTheDocument();
    });

    it('switches between complex overview and settings', async () => {
        const { user } = renderPlanner();
        await startComplexPlanning(user);

        await user.click(plannerUi.overviewButton());
        expect(
            plannerUi.overviewAccordion(/unknown elements|All street parts are known and resolved/)
        ).toBeInTheDocument();

        await user.click(plannerUi.settingsButton());
        expect(plannerUi.settingsButton()).toBeInTheDocument();
        expect(plannerUi.absentButton('Nodes')).toBeNull();
        expect(plannerUi.absentButton('Priorities')).toBeNull();
    });
});
