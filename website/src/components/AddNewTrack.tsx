import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';

export function AddNewTrack() {
    const dispatch = useDispatch();
    return (
        <tr onClick={() => dispatch(trackMergeActions.addTrackComposition())}>
            <td colSpan={2}>+</td>
        </tr>
    );
}
