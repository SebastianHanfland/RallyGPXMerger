import { AppDispatch } from '../store/store.ts';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { calculateMerge } from '../logic/MergeCalculation.ts';

export function MergeTracksButton() {
    const dispatch: AppDispatch = useDispatch();
    return (
        <Button className={'m-2'} onClick={() => dispatch(calculateMerge)}>
            Merge Tracks
        </Button>
    );
}
