import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';

export function AddNewTrack() {
    const dispatch = useDispatch();
    return (
        <tr onClick={() => dispatch(trackMergeActions.addTrackComposition())} style={{ height: '54.5px' }}>
            <td colSpan={3}>
                <div className={'m-2'}>+</div>
            </td>
        </tr>
    );
}
