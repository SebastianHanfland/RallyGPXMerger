import { useDispatch, useSelector } from 'react-redux';
import { getIsSidebarOpen, layoutActions } from '../store/layout.reducer.ts';
import { CSSProperties } from 'react';

const getStyle = (width: number): CSSProperties => ({
    position: 'fixed',
    width: '40px',
    height: '40px',
    right: `${width}px`,
    overflowY: 'scroll',
    top: 0,
    zIndex: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    cursor: 'pointer',
});

export function ClosePlannerSidebar() {
    const dispatch = useDispatch();
    const isSidebarOpen = useSelector(getIsSidebarOpen);

    return (
        <div
            onClick={(event) => {
                event.stopPropagation();
                dispatch(layoutActions.setIsSidebarOpen(!isSidebarOpen));
            }}
            style={getStyle(isSidebarOpen ? 900 : 30)}
        >
            {isSidebarOpen ? '>>' : '<<'}
        </div>
    );
}
