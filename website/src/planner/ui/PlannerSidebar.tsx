import { CSSProperties, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { PlannerSidebarContent } from './PlannerSidebarContent.tsx';
import { PlannerSidebarNavigation } from './PlannerSidebarNavigation.tsx';
import { PlannerSidebarSimpleContent } from './PlannerSidebarSimpleContent.tsx';
import { PlannerSidebarSimpleNavigation } from './PlannerSidebarSimpleNavigation.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getHasSingleTrack, getIsSidebarOpen, layoutActions } from '../store/layout.reducer.ts';

const getStyle = (width: number): CSSProperties => ({
    position: 'fixed',
    width: `${width}px`,
    height: '100vh',
    right: 0,
    overflowY: 'scroll',
    top: 0,
    zIndex: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
});

export type SidebarSections = 'segments' | 'tracks' | 'documents' | 'settings';

function ComplexContent(props: {
    setSelectedSection: (value: SidebarSections) => void;
    selectedSection: SidebarSections;
}) {
    return (
        <div>
            <PlannerSidebarNavigation setSelectedSection={props.setSelectedSection} />
            <PlannerSidebarContent selectedSection={props.selectedSection} />
        </div>
    );
}

function SimpleContent(props: {
    setSelectedSection: (value: SidebarSections) => void;
    selectedSection: SidebarSections;
}) {
    return (
        <div>
            <PlannerSidebarSimpleNavigation setSelectedSection={props.setSelectedSection} />
            <PlannerSidebarSimpleContent selectedSection={props.selectedSection} />
        </div>
    );
}

function Content(props: { setSelectedSection: (value: SidebarSections) => void; selectedSection: SidebarSections }) {
    const hasSingleTrack = useSelector(getHasSingleTrack);
    return hasSingleTrack ? (
        <SimpleContent setSelectedSection={props.setSelectedSection} selectedSection={props.selectedSection} />
    ) : (
        <ComplexContent setSelectedSection={props.setSelectedSection} selectedSection={props.selectedSection} />
    );
}

export function PlannerSidebar() {
    const [selectedSection, setSelectedSection] = useState<SidebarSections>('segments');
    const showSidebar = useSelector(getIsSidebarOpen);
    const dispatch = useDispatch();

    return (
        <div
            style={getStyle(showSidebar ? 900 : 30)}
            className={'shadow'}
            onClick={() => dispatch(layoutActions.setIsSidebarOpen(true))}
            title={'See overview'}
        >
            {showSidebar ? (
                <Content setSelectedSection={setSelectedSection} selectedSection={selectedSection} />
            ) : (
                <span style={{ writingMode: 'vertical-lr' }} className={'my-3'}>
                    <FormattedMessage id={'msg.dashboard'} />
                </span>
            )}
        </div>
    );
}
