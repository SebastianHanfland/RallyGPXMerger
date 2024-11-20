import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getArrivalDateTime, getHasDefaultArrivalDateTime } from '../store/trackMerge.reducer.ts';
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
    const hasDefaultTime = useSelector(getHasDefaultArrivalDateTime);
    const arrivalDateTime = useSelector(getArrivalDateTime);
    const dispatch = useDispatch();

    if (!hasDefaultTime || !arrivalDateTime) {
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
