import { AppDispatch } from '../store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import { calculateMerge } from '../logic/MergeCalculation.ts';
import { useEffect, useState } from 'react';
import { getArrivalDateTime } from '../store/trackMerge.reducer.ts';

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
        >
            {isLoading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <div>Merge Tracks</div>
            )}
        </Button>
    );
}
