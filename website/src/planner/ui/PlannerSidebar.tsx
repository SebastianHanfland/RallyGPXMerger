import { CSSProperties, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { PlannerSidebarContent } from './PlannerSidebarContent.tsx';

const getStyle = (width: number): CSSProperties => ({
    position: 'fixed',
    width: `${width}px`,
    height: '100vh',
    right: 0,
    overflowY: 'scroll',
    top: 0,
    zIndex: 10,
    backgroundColor: 'white',
    cursor: 'pointer',
    overflow: 'hidden',
});

export function PlannerSidebar() {
    const [show, setShow] = useState(false);
    return (
        <div
            style={getStyle(show ? 400 : 30)}
            className={'shadow'}
            onClick={() => setShow(!show)}
            title={'See overview'}
        >
            {show ? (
                <PlannerSidebarContent />
            ) : (
                <span style={{ writingMode: 'vertical-lr' }} className={'my-3'}>
                    <FormattedMessage id={'msg.dashboard'} />
                </span>
            )}
        </div>
    );
}
