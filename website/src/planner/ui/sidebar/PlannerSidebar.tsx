import { CSSProperties } from 'react';
import { FormattedMessage } from 'react-intl';
import { PlannerSidebarContent } from './complex/PlannerSidebarContent.tsx';
import { PlannerSidebarNavigation } from './complex/PlannerSidebarNavigation.tsx';
import { PlannerSidebarSimpleContent } from './simple/PlannerSidebarSimpleContent.tsx';
import { PlannerSidebarSimpleNavigation } from './simple/PlannerSidebarSimpleNavigation.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getHasSingleTrack, getIsSidebarOpen, layoutActions } from '../../store/layout.reducer.ts';
import { ClosePlannerSidebar } from '../elements/ClosePlannerSidebar.tsx';

const getStyle = (showSidebar: boolean): CSSProperties => ({
    position: 'fixed',
    width: `${showSidebar ? '50vw' : '30px'}`,
    height: '100vh',
    right: 0,
    top: 0,
    zIndex: 10,
    backgroundColor: 'white',
    overflowX: 'hidden',
    overflowY: 'scroll',
    cursor: showSidebar ? undefined : 'pointer',
});

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
                    <div className={'mb-5'} style={{ height: '100vh' }}>
                        <Content />
                    </div>
                ) : (
                    <span style={{ writingMode: 'vertical-lr' }} className={'my-3'}>
                        <FormattedMessage id={'msg.planning'} />
                    </span>
                )}
            </div>
        </>
    );
}
