import { CSSProperties } from 'react';
import { useIntl } from 'react-intl';
import house from '../../assets/house.svg';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { getPlanningId } from '../store/backend.reducer.ts';

const homeStyle: CSSProperties = {
    position: 'fixed',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    left: 10,
    bottom: 10,
    zIndex: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    cursor: 'pointer',
};

export function PlannerHomeButton() {
    const navigateTo = useNavigate();
    const planningId = useSelector(getPlanningId);
    const intl = useIntl();

    return (
        <div
            style={homeStyle}
            onClick={() => {
                navigateTo(`?section=menu${planningId ? `&planning=${planningId}` : ''}`);
            }}
            className={'shadow'}
            title={intl.formatMessage({ id: 'msg.menu' })}
        >
            <img src={house} alt={'house'} style={{ width: '40px', height: '40px' }} />
        </div>
    );
}
