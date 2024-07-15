import { useDispatch, useSelector } from 'react-redux';
import { getIsCalculationOnTheFly, getIsCalculationRunning, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { CSSProperties } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { calculateTracks } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/store.ts';

const calculationIsRunningStyle: CSSProperties = {
    position: 'fixed',
    width: '220px',
    height: '45px',
    borderRadius: '2px',
    left: 10,
    top: 80,
    zIndex: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    cursor: 'pointer',
    color: 'red',
};

export const CalculationOnTheFly = () => {
    const isCalculationOnTheFly = useSelector(getIsCalculationOnTheFly);
    const isRunning = useSelector(getIsCalculationRunning);
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
            {!isCalculationOnTheFly && (
                <Button
                    id={'tracks'}
                    title={'Calculate tracks'}
                    variant={'light'}
                    className={'shadow my-1 mx-1'}
                    onClick={() => dispatch(calculateTracks)}
                    disabled={isRunning}
                >
                    <FormattedMessage id={'msg.calculate'} />
                </Button>
            )}
        </div>
    );
};
