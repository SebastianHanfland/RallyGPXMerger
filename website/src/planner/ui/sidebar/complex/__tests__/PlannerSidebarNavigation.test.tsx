import { act, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';
import { getMessages } from '../../../../../lang/getMessages.ts';
import { createPlanningStore } from '../../../../store/planningStore.ts';
import { pointsActions } from '../../../../store/points.reducer.ts';
import { trackMergeActions } from '../../../../store/trackMerge.reducer.ts';
import { PointOfInterestType } from '../../../../store/types.ts';
import { PlannerSidebarNavigation } from '../PlannerSidebarNavigation.tsx';

const messages = getMessages('en');

function renderNavigation() {
    const store = createPlanningStore();

    render(
        <Provider store={store}>
            <IntlProvider locale="en" messages={messages}>
                <PlannerSidebarNavigation />
            </IntlProvider>
        </Provider>
    );

    return store;
}

function getOverviewLink() {
    return screen.getByText(messages['msg.overview']).closest('a');
}

describe('PlannerSidebarNavigation', () => {
    it('shows a check when every status-bearing overview accordion is complete', () => {
        renderNavigation();

        expect(screen.getByAltText('checkIcon')).toBeInTheDocument();
        expect(screen.queryByAltText('warning')).not.toBeInTheDocument();
        expect(getOverviewLink()).not.toHaveAttribute('title');
    });

    it('shows a warning and lists the incomplete accordions in the Overview title', () => {
        const store = renderNavigation();

        act(() => {
            store.dispatch(
                pointsActions.addPoint({
                    id: 'todo',
                    lat: 0,
                    lng: 0,
                    title: 'Todo',
                    description: 'Todo',
                    type: PointOfInterestType.TODO,
                    radiusInM: 1,
                })
            );
            store.dispatch(trackMergeActions.setTracks([{ id: 'track', segments: [] }]));
        });

        expect(screen.getByAltText('warning')).toBeInTheDocument();
        expect(screen.queryByAltText('checkIcon')).not.toBeInTheDocument();
        expect(getOverviewLink()).toHaveAttribute(
            'title',
            [
                messages['msg.overviewWarnings'],
                messages['msg.points'],
                messages['msg.startNameOverwrite'],
                messages['msg.communicatedStart'],
            ].join('\n')
        );
    });

    it('returns to a check after the warning state is resolved', () => {
        const store = renderNavigation();

        act(() => {
            store.dispatch(
                pointsActions.addPoint({
                    id: 'todo',
                    lat: 0,
                    lng: 0,
                    title: 'Todo',
                    description: 'Todo',
                    type: PointOfInterestType.TODO,
                    radiusInM: 1,
                })
            );
        });
        expect(screen.getByAltText('warning')).toBeInTheDocument();

        act(() => {
            store.dispatch(pointsActions.removePoint('todo'));
        });

        expect(screen.getByAltText('checkIcon')).toBeInTheDocument();
        expect(screen.queryByAltText('warning')).not.toBeInTheDocument();
        expect(getOverviewLink()).not.toHaveAttribute('title');
    });
});
