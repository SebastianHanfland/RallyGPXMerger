import { CSSProperties } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../store/layout.reducer.ts';
import { Sections } from '../layout/types.ts';
import house from '../../assets/house.svg';

const homeStyle: CSSProperties = {
    position: 'fixed',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    left: 10,
    bottom: 50,
    zIndex: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    cursor: 'pointer',
};

export function PlannerHomeButton() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));

    return (
        <div
            style={homeStyle}
            onClick={() => setSelectedSection('menu')}
            className={'shadow'}
            title={intl.formatMessage({ id: 'msg.menu' })}
        >
            <img src={house} alt={'house'} style={{ width: '40px', height: '40px' }} />
        </div>
    );
}
