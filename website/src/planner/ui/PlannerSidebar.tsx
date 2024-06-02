import { CSSProperties, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { PlannerSidebarContent } from './PlannerSidebarContent.tsx';
import { PlannerSidebarNavigation } from './PlannerSidebarNavigation.tsx';
import { PlannerHomeButton } from './PlannerHomeButton.tsx';

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
                <div>
                    <PlannerSidebarNavigation setSelectedSection={setSelectedSection} />
                    <PlannerSidebarContent selectedSection={selectedSection} />
                </div>
            ) : (
                <span style={{ writingMode: 'vertical-lr' }} className={'my-3'}>
                    <FormattedMessage id={'msg.dashboard'} />
                </span>
            )}
            <PlannerHomeButton />
        </div>
    );
}
