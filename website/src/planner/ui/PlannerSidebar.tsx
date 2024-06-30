import { CSSProperties, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { PlannerSidebarContent } from './PlannerSidebarContent.tsx';
import { PlannerSidebarNavigation } from './PlannerSidebarNavigation.tsx';
import { PlannerHomeButton } from './PlannerHomeButton.tsx';
import { PlannerSidebarSimpleContent } from './PlannerSidebarSimpleContent.tsx';
import { PlannerSidebarSimpleNavigation } from './PlannerSidebarSimpleNavigation.tsx';
import { useSelector } from 'react-redux';
import { getHasSingleTrack } from '../store/layout.reducer.ts';
import { TimeSlider } from '../map/TimeSlider.tsx';

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
    const [show, setShow] = useState(false);
    const [selectedSection, setSelectedSection] = useState<SidebarSections>('segments');

    return (
        <div
            style={getStyle(show ? 900 : 30)}
            className={'shadow'}
            onClick={() => setShow(true)}
            title={'See overview'}
        >
            {show ? (
                <Content setSelectedSection={setSelectedSection} selectedSection={selectedSection} />
            ) : (
                <span style={{ writingMode: 'vertical-lr' }} className={'my-3'}>
                    <FormattedMessage id={'msg.dashboard'} />
                </span>
            )}
            <PlannerHomeButton />
            <TimeSlider />
        </div>
    );
}
