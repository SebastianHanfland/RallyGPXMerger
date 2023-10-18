import { AppDispatch } from '../store/store.ts';
import { useDispatch } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import { calculateMerge } from '../logic/MergeCalculation.ts';
import { useEffect, useState } from 'react';

export function MergeTracksButton() {
    const dispatch: AppDispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => setIsLoading(false), 2000);
        }
    }, [isLoading]);

    return (
        <Button
            className={'m-2'}
            onClick={() => {
                setIsLoading(true);
                dispatch(calculateMerge);
            }}
            disabled={isLoading}
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
