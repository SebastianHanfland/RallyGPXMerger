import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getPlanningTitle } from '../store/trackMerge.reducer.ts';
import { CSSProperties } from 'react';
import { layoutActions } from '../store/layout.reducer.ts';
import { Warning } from '../layout/dashboard/Warning.tsx';

const noTileWarningStyle: CSSProperties = {
    position: 'fixed',
    width: '650px',
    height: '35px',
    borderRadius: '2px',
    left: 80,
    top: 45,
    zIndex: 10,
    backgroundColor: 'white',
    paddingTop: '5px',
    overflow: 'hidden',
    cursor: 'pointer',
    color: 'red',
};

export function NoTitleWarning() {
    const intl = useIntl();
    const planningTitle = useSelector(getPlanningTitle);
    const dispatch = useDispatch();

    if (!planningTitle) {
        return null;
    }

    return (
        <div
            style={noTileWarningStyle}
            className={'shadow'}
            onClick={() => {
                dispatch(layoutActions.setIsSidebarOpen(true));
                dispatch(layoutActions.setSelectedSidebarSection('settings'));
            }}
            title={intl.formatMessage({ id: 'msg.setArrivalDateTime' })}
        >
            <Warning />
            {`${intl.formatMessage({ id: 'msg.defaultTitle' })}`}
        </div>
    );
}
