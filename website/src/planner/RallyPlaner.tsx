import '../App.css';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store.ts';
import { RallyPlannerRouter } from './layout/RallyPlannerRouter.tsx';
import { Dashboard } from './layout/dashboard/Dashboard.tsx';
import { CSSProperties } from 'react';
import { layoutActions } from './store/layout.reducer.ts';
import info from '../assets/info.svg';

const style: CSSProperties = {
    position: 'fixed',
    width: '30px',
    height: '100vh',
    left: 0,
    right: 0,
    overflowY: 'scroll',
    top: 0,
    zIndex: 10,
    backgroundColor: '#0d6efd',
    cursor: 'pointer',
};

function FloatingInfoButton() {
    const dispatch = useDispatch();
    return (
        <div style={style} className={'shadow'} onClick={() => dispatch(layoutActions.setShowDashboard(true))}>
            <img
                src={info}
                className={'m-1'}
                style={{ height: '20px', width: '20px', position: 'fixed', top: '48vh', left: 0 }}
                alt="help"
            />
        </div>
    );
}

export function RallyPlaner() {
    return (
        <Provider store={store}>
            <div style={{ left: '30px', position: 'fixed' }}>
                <RallyPlannerRouter />
            </div>
            <FloatingInfoButton />
            <Dashboard />
        </Provider>
    );
}
