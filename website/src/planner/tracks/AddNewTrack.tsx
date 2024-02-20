import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { FormattedMessage } from 'react-intl';

export function AddNewTrack() {
    const dispatch = useDispatch();
    return (
        <tr
            onClick={() => dispatch(trackMergeActions.addTrackComposition())}
            style={{ height: '54.5px', cursor: 'pointer' }}
        >
            <td colSpan={4}>
                <div className={'m-2'}>
                    + <FormattedMessage id={'msg.addNewTrack'} />
                </div>
            </td>
        </tr>
    );
}
