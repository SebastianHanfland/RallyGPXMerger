import { AppDispatch } from '../store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import { calculateMerge } from '../logic/MergeCalculation.ts';
import { useEffect, useState } from 'react';
import { getArrivalDateTime } from '../store/trackMerge.reducer.ts';
import magic from '../assets/magic.svg';

export function MergeTracksButton() {
    const dispatch: AppDispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const arrivalDate = useSelector(getArrivalDateTime);

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => setIsLoading(false), 2000);
        }
    }, [isLoading]);

    return (
        <Button
            onClick={() => {
                setIsLoading(true);
                dispatch(calculateMerge);
            }}
            disabled={isLoading || !arrivalDate}
            variant={'success'}
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
