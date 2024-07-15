import { CSSProperties } from 'react';
import { FormattedMessage } from 'react-intl';
import { PlannerSidebarContent } from './PlannerSidebarContent.tsx';
import { PlannerSidebarNavigation } from './PlannerSidebarNavigation.tsx';
import { PlannerSidebarSimpleContent } from './PlannerSidebarSimpleContent.tsx';
import { PlannerSidebarSimpleNavigation } from './PlannerSidebarSimpleNavigation.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getHasSingleTrack, getIsSidebarOpen, layoutActions } from '../store/layout.reducer.ts';
import { ClosePlannerSidebar } from './ClosePlannerSidebar.tsx';

const getStyle = (showSidebar: boolean): CSSProperties => ({
    position: 'fixed',
    width: `${showSidebar ? 900 : 30}px`,
    height: '100vh',
    right: 0,
    overflowY: 'scroll',
    top: 0,
    zIndex: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    cursor: showSidebar ? undefined : 'pointer',
});

export type SidebarSections = 'segments' | 'tracks' | 'documents' | 'settings';

function ComplexContent() {
    return (
        <div>
            <PlannerSidebarNavigation />
            <PlannerSidebarContent />
        </div>
    );
}

function SimpleContent() {
    return (
        <div>
            <PlannerSidebarSimpleNavigation />
            <PlannerSidebarSimpleContent />
        </div>
    );
}

function Content() {
    const hasSingleTrack = useSelector(getHasSingleTrack);
    return hasSingleTrack ? <SimpleContent /> : <ComplexContent />;
}

export function PlannerSidebar() {
    const showSidebar = useSelector(getIsSidebarOpen);
    const dispatch = useDispatch();

    return (
        <>
            <ClosePlannerSidebar />
            <div
                style={getStyle(showSidebar)}
                className={'shadow'}
                onClick={() => dispatch(layoutActions.setIsSidebarOpen(true))}
                title={showSidebar ? undefined : 'See overview'}
            >
                {showSidebar ? (
                    <Content />
                ) : (
                    <span style={{ writingMode: 'vertical-lr' }} className={'my-3'}>
                        <FormattedMessage id={'msg.dashboard'} />
                    </span>
                )}
            </div>
        </>
    );
}
