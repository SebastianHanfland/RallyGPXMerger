import { useDispatch, useSelector } from 'react-redux';
import {
    getHasChangesSinceLastCalculation,
    getIsCalculationOnTheFly,
    getIsCalculationRunning,
    trackMergeActions,
} from '../store/trackMerge.reducer.ts';
import { CSSProperties } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { calculateTracks } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { Warning } from '../layout/dashboard/Warning.tsx';

const calculationIsRunningStyle: CSSProperties = {
    position: 'fixed',
    width: '260px',
    height: '45px',
    borderRadius: '2px',
    left: 10,
    top: 80,
    zIndex: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    cursor: 'pointer',
    color: 'red',
    display: 'flex',
};

export const CalculationOnTheFly = () => {
    const isCalculationOnTheFly = useSelector(getIsCalculationOnTheFly);
    const isRunning = useSelector(getIsCalculationRunning);
    const hasChanges = useSelector(getHasChangesSinceLastCalculation);
    const dispatch: AppDispatch = useDispatch();

    return (
        <div style={calculationIsRunningStyle}>
            <Button
                id={'tracks'}
                title={'Calculated Tracks'}
                variant={isCalculationOnTheFly ? 'success' : 'light'}
                className={'shadow my-1'}
                onClick={() => dispatch(trackMergeActions.setIsCalculationOnTheFly(!isCalculationOnTheFly))}
            >
                <FormattedMessage id={'msg.onTheFly'} />
            </Button>
            {!isCalculationOnTheFly ? (
                <Button
                    id={'tracks'}
                    title={'Calculate tracks'}
                    variant={hasChanges ? 'warning' : 'light'}
                    className={'shadow my-1 mx-1'}
                    onClick={() => dispatch(calculateTracks())}
                    disabled={isRunning}
                >
                    {hasChanges && <Warning size={13} />}
                    <FormattedMessage id={'msg.calculate'} />
                </Button>
            ) : (
                <div></div>
            )}
        </div>
    );
};
