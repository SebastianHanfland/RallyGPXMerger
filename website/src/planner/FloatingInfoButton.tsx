import { useDispatch } from 'react-redux';
import { layoutActions } from './store/layout.reducer.ts';
import { CSSProperties } from 'react';
import { FormattedMessage } from 'react-intl';

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
    overflow: 'hidden',
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
            <span style={{ writingMode: 'vertical-lr' }} className={'my-3'}>
                <FormattedMessage id={'msg.dashboard'} />
            </span>
        </div>
    );
}
