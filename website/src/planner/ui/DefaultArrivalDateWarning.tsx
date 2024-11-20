import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getArrivalDateTime, getHasDefaultArrivalDateTime } from '../store/trackMerge.reducer.ts';
import { CSSProperties } from 'react';
import { formatDate } from '../../utils/dateUtil.ts';
import { getHasSingleTrack, layoutActions } from '../store/layout.reducer.ts';
import { Warning } from '../layout/dashboard/Warning.tsx';

const defaultTimeWarning: CSSProperties = {
    position: 'fixed',
    width: '650px',
    height: '35px',
    borderRadius: '2px',
    left: 80,
    top: 5,
    zIndex: 10,
    backgroundColor: 'white',
    paddingTop: '5px',
    overflow: 'hidden',
    cursor: 'pointer',
    color: 'red',
};

export function DefaultArrivalDateWarning() {
    const intl = useIntl();
    const hasDefaultTime = useSelector(getHasDefaultArrivalDateTime);
    const arrivalDateTime = useSelector(getArrivalDateTime);
    const hasOnlySingleTrack = useSelector(getHasSingleTrack);
    const dispatch = useDispatch();

    if (!hasDefaultTime || !arrivalDateTime) {
        return null;
    }

    return (
        <div
            style={defaultTimeWarning}
            className={'shadow'}
            onClick={() => {
                dispatch(layoutActions.setIsSidebarOpen(true));
                if (!hasOnlySingleTrack) {
                    dispatch(layoutActions.setSelectedSidebarSection('settings'));
                }
            }}
            title={intl.formatMessage({ id: 'msg.setArrivalDateTime' })}
        >
            <Warning />
            {` ${intl.formatMessage({ id: 'msg.defaultArrivalTime' })}: ${formatDate(arrivalDateTime)}`}
        </div>
    );
}
