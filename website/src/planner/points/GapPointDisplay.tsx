import { GapPoint } from '../store/types.ts';
import { GeoLinkIcon } from '../../utils/icons/GeoLinkIcon.tsx';
import { useDispatch } from 'react-redux';
import { mapActions } from '../store/map.reducer.ts';

export function GapPointDisplay({ gapPoint }: { gapPoint: GapPoint }) {
    const { title, description } = gapPoint;
    const dispatch = useDispatch();

    return (
        <tr>
            <td key={'key'}>
                <div>{title}</div>
            </td>
            <td key={'description'}>
                <div>{description}</div>
            </td>
            <td key={'description'}>
                <div onClick={() => dispatch(mapActions.setPointToCenter(gapPoint))}>
                    <GeoLinkIcon />
                </div>
            </td>
        </tr>
    );
}
