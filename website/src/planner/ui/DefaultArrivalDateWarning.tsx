import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { getArrivalDateTime, getHasDefaultArrivalDateTime } from '../store/trackMerge.reducer.ts';
import { CSSProperties } from 'react';
import { formatDate } from '../../utils/dateUtil.ts';
import { layoutActions } from '../store/layout.reducer.ts';

const defaultTimeWarning: CSSProperties = {
    position: 'fixed',
    width: '650px',
    height: '30px',
    borderRadius: '2px',
    left: 80,
    top: 10,
    zIndex: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    cursor: 'pointer',
    color: 'red',
};

export function DefaultArrivalDateWarning() {
    const intl = useIntl();
    const hasDefaultTime = useSelector(getHasDefaultArrivalDateTime);
    const arrivalDateTime = useSelector(getArrivalDateTime);
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
            }}
            title={intl.formatMessage({ id: 'msg.setArrivalDateTime' })}
        >
            {`(!) ${intl.formatMessage({ id: 'msg.defaultArrivalTime' })}: ${formatDate(arrivalDateTime)}`}
        </div>
    );
}
