import { useDispatch } from 'react-redux';
import { layoutActions } from './store/layout.reducer.ts';
import info from '../assets/info.svg';
import { CSSProperties } from 'react';

const style: CSSProperties = {
    position: 'fixed',
    width: '30px',
    height: '100vh',
    left: 0,
    right: 0,
    overflowY: 'scroll',
    top: 0,
    zIndex: 10,
    backgroundColor: 'rgba(220,220,255,1)',
    cursor: 'pointer',
};

export function FloatingInfoButton() {
    const dispatch = useDispatch();
    return (
        <div
            style={style}
            className={'shadow'}
            onClick={() => dispatch(layoutActions.setShowDashboard(true))}
            title={'See overview'}
        >
            <img
                src={info}
                className={'m-1'}
                style={{ height: '20px', width: '20px', position: 'fixed', top: '48vh', left: 0 }}
                alt="help"
            />
        </div>
    );
}
