import { useDispatch, useSelector } from 'react-redux';
import { getIsCalculationRunning, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { CSSProperties, useEffect } from 'react';
import breakIcon from '../../assets/break.svg';

const calculationIsRunningStyle: CSSProperties = {
    position: 'fixed',
    width: '40px',
    height: '40px',
    borderRadius: '2px',
    left: 40,
    top: 10,
    zIndex: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    cursor: 'pointer',
    color: 'red',
};

export const CalculationIsRunning = () => {
    const isCalculationRunning = useSelector(getIsCalculationRunning);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(trackMergeActions.setIsCalculationRunning(false));
    }, []);
    if (!isCalculationRunning) {
        return null;
    }
    return (
        <div style={calculationIsRunningStyle}>
            <img src={breakIcon} alt={'waiting'} />
        </div>
    );
};
