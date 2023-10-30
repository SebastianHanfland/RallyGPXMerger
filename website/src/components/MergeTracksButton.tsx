import { AppDispatch } from '../store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import { calculateMerge } from '../logic/MergeCalculation.ts';
import { getArrivalDateTime, getIsCalculating, trackMergeActions } from '../store/trackMerge.reducer.ts';
import magic from '../assets/magic.svg';

export function MergeTracksButton() {
    const dispatch: AppDispatch = useDispatch();
    const arrivalDate = useSelector(getArrivalDateTime);
    const isLoading = useSelector(getIsCalculating);

    return (
        <Button
            onClick={() => {
                dispatch(trackMergeActions.setIsCalculating(true));
                setTimeout(() => {
                    dispatch(calculateMerge).then(() => {
                        dispatch(trackMergeActions.setIsCalculating(false));
                    });
                }, 50);
            }}
            disabled={isLoading || !arrivalDate}
            variant={'success'}
            title={'Merge GPX segments to tracks and adjust the times'}
        >
            {isLoading ? (
                <Spinner animation="border" role="status" size={'sm'}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <img src={magic} className="m-1" alt="magic wand" />
            )}
            <span>Merge Tracks</span>)
        </Button>
    );
}
